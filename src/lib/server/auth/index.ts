import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { db } from "../db";
import * as schema from "$lib/server/db/schema";
import {
	sendDeleteAccountVerificationEmail,
	sendResetPasswordEmail,
	sendVerificationEmail,
} from "../emails";
import { attachUserToProfileHook, getProfileHook } from "./hooks";
// Better Auth plugins
import {
	username,
	lastLoginMethod,
	admin,
	jwt,
	twoFactor,
} from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { oauthProvider } from "@better-auth/oauth-provider";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { APIError } from "better-auth";
import { dev } from "$app/environment";

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: schema,
	}),
	user: {
		additionalFields: {
			profileId: {
				type: "string",
				required: true,
			},
		},
		deleteUser: {
			enabled: true,
			sendDeleteAccountVerification: async ({ user, url, token }) => {
				await sendDeleteAccountVerificationEmail({
					to: user.email,
					url,
					token,
				});
			},
		},
		changeEmail: {
			enabled: false,
		},
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url, token }) => {
			await sendResetPasswordEmail({
				to: user.email,
				url,
				token,
			});
		},
	},
	// emailVerification: {
	// 	sendOnSignUp: true,
	// 	sendOnSignIn: true,
	// 	autoSignInAfterVerification: true,
	// 	sendVerificationEmail: async ({ user, url, token }) => {
	// 		await sendVerificationEmail({
	// 			to: user.email,
	// 			url,
	// 			token,
	// 		});
	// 	},
	// },
	disabledPaths: ["/token"],
	plugins: [
		admin(),
		username(),
		lastLoginMethod(),
		passkey(),
		twoFactor(),
		jwt({
			disableSettingJwtHeader: true,
		}),
		oauthProvider({
			loginPage: "/auth/signin/",
			consentPage: "/auth/consent/",
		}),
		// make sure this is the last plugin in the array
		sveltekitCookies(getRequestEvent),
	],
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					console.log(user.id);

					const profile = await getProfileHook(user.profileId as string);

					if (profile.userId) {
						throw new APIError("CONFLICT", {
							code: "PROFILE_ALREADY_LINKED",
							message: "This profile is already linked to another account.",
						});
					}

					return {
						data: {
							...user,
							email: profile.officialEmail,
							username: profile.studentId,
							displayUsername: profile.studentId,
							name: profile.name,
							image: profile.avatar,
						},
					};
				},
				after: async (user) => {
					await attachUserToProfileHook(user.profileId as string, user.id);
				},
			},
		},
	},
	logger: {
		level: dev ? "debug" : "warn",
	},
});
