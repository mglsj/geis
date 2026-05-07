import type { Actions, PageServerLoad } from "./$types";
import { message, superValidate } from "sveltekit-superforms";
import { erpLoginFormSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect, fail } from "@sveltejs/kit";
import { login } from "$lib/server/erp/auth";
import { fetchAvatar, fetchProfile } from "$lib/server/erp/student";
import { db } from "$lib/server/db";
import { profile as profileTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

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
			.where(eq(profileTable.studentId, form.data.username))
			.execute();

		let profileId: string | undefined;

		if (result && result.length > 0) {
			const { id, userId } = result[0];

			if (userId) {
				form.errors.username = [
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
					form.errors.username = [e];
					form.errors.password = [e];
				} else {
					form.errors.username = [e];
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
				.where(eq(profileTable.id, profileId))
				.execute();

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
} satisfies Actions;
