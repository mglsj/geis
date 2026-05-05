import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate } from "sveltekit-superforms";
import { erpLoginFormSchema, signupFormSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect, fail, isRedirect } from "@sveltejs/kit";
import { login } from "$lib/server/erp/auth";
import { fetchAvatar, fetchProfile } from "$lib/server/erp/student";
import { db } from "$lib/server/db";
import { profile as profileTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import { auth } from "$lib/server/auth";
import { APIError } from "better-auth";
import { getAuthURL } from "$lib/helpers/urls";

export const load: PageServerLoad = async ({ locals, parent }) => {
	if (locals.user && locals.session) {
		const { callback } = await parent();

		callback.searchParams.set("toast", "Already signed in");

		throw redirect(302, callback);
	}
};

export const actions = {
	login: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod4(erpLoginFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await db
			.select({
				id: profileTable.id,
				userId: profileTable.userId,
			})
			.from(profileTable)
			.where(eq(profileTable.studentId, form.data.id));

		let profileId: string | undefined;

		if (result && result.length > 0) {
			const { id, userId } = result[0];

			if (userId) {
				form.errors.id = [
					"A user with this profile already exists. Please login instead.",
				];
				return fail(400, { form });
			}

			profileId = id;
		}

		const error = await login({
			data: form.data,
			cookies,
			secure: url.protocol === "https:",
		});

		if (error) {
			if (error.code === 400) {
				// cookie error, reload page
				return redirect(302, url);
			} else if (error.code === 401) {
				const e = error.error;
				if (e.includes("Captcha does not match")) {
					form.errors.captcha = [e];
				} else if (
					e.includes("The user name or password provided is incorrect") ||
					e.includes("Invalid username or password")
				) {
					form.errors.id = [e];
					form.errors.password = [e];
				} else {
					form.errors.id = [e];
					form.errors.password = [e];
					form.errors.captcha = [e];
				}

				return fail(400, { form });
			}
		}

		const profile = await fetchProfile(cookies);
		const avatar = await fetchAvatar(cookies);

		if (profileId) {
			const result = await db
				.update(profileTable)
				.set({
					avatar,
					...profile,
					syncedAt: new Date(),
				})
				.where(eq(profileTable.id, profileId));

			if (!result) {
				return message(form, "Failed to update profile. Please try again.", {
					status: 500,
				});
			}
		} else {
			profileId = randomUUID().toString();
			const result2 = await db.insert(profileTable).values({
				id: profileId,
				avatar,
				...profile,
				syncedAt: new Date(),
			});

			if (!result2) {
				return message(form, "Failed to create profile. Please try again.", {
					status: 500,
				});
			}
		}

		return {
			form,
			username: profile.studentId,
			name: profile.name,
			email: profile.officialEmail,
			image: avatar,
			profileId,
		};
	},
	signup: async ({ request, url }) => {
		const form = await superValidate(request, zod4(signupFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const profileResult = await db
				.select()
				.from(profileTable)
				.where(eq(profileTable.id, form.data.profileId));

			if (!profileResult || profileResult.length === 0) {
				return message(
					form,
					"Profile not found. Please complete ERP login first.",
					{
						status: 404,
					},
				);
			}

			const profile = profileResult[0];

			if (profile.userId) {
				return message(
					form,
					"A user account for this profile already exists. Please login instead.",
					{
						status: 409,
					},
				);
			}

			const callback = new URL(form.data.callbackURL || "/", url.origin);

			const data = await auth.api.signUpEmail({
				body: {
					email: profile.officialEmail,
					username: profile.studentId,
					name: profile.name,
					password: form.data.password,
					callbackURL: callback.toString(),
					image: profile.avatar ?? undefined,
					rememberMe: true,
				},
				headers: request.headers,
			});

			const setUserIdResult = await db
				.update(profileTable)
				.set({ userId: data.user.id })
				.where(eq(profileTable.id, form.data.profileId))
				.execute();

			if (!setUserIdResult) {
				await auth.api.deleteUser({
					body: {
						token: data.token ?? undefined,
						password: form.data.password,
					},
					headers: request.headers,
				});

				console.error(
					"Failed to link profile to user account for profile ID:",
					form.data.profileId,
				);

				return message(
					form,
					"Failed to link profile to user account. Please contact support.",
					{
						status: 500,
					},
				);
			}

			if (!data.user.emailVerified) {
				const verifyEmailURL = getAuthURL("verify", {
					origin: url.origin,
					searchParams: {
						callback: callback.toString(),
						email: profile.officialEmail,
					},
				});
				throw redirect(302, verifyEmailURL);
			} else {
				throw redirect(302, callback.toString());
			}
		} catch (error) {
			if (isRedirect(error)) {
				throw error;
			} else if (error instanceof APIError) {
				console.error("Better Auth API error during sign up:", error);

				return fail(error.statusCode, {
					form,
					message: error.message,
				});
			} else {
				console.error("Error signing up:", error);
				return message(
					form,
					"An unexpected error occurred. Please try again.",
					{
						status: 500,
					},
				);
			}
		}
	},
} satisfies Actions;
