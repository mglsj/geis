import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { env } from "$env/dynamic/private";
import { getRequestEvent } from "$app/server";
import { db } from "./db";
import * as schema from "./db/auth.schema";
import { jwt } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import { oauthProvider } from "@better-auth/oauth-provider";
import { admin } from "better-auth/plugins";
import { lastLoginMethod } from "better-auth/plugins";
import { sendVerificationEmail } from "./emails";

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, {
		provider: "sqlite",
		schema: schema,
	}),
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		revokeSessionsOnPasswordReset: true,
		sendResetPassword: async ({ user, url, token }) => {
			console.log(
				`Sending password reset email to ${user.email} with url: ${url} and token: ${token}`,
			);
			return Promise.resolve();
		},
	},
	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url, token }) => {
			await sendVerificationEmail({
				to: user.email,
				url,
				token,
			});
		},
	},
	disabledPaths: ["/token"],
	plugins: [
		admin(),
		lastLoginMethod(),
		passkey({}),
		jwt({
			disableSettingJwtHeader: true,
		}),
		oauthProvider({
			loginPage: "/auth/signin/",
			consentPage: "/auth/consent/",
		}),
		sveltekitCookies(getRequestEvent), // make sure this is the last plugin in the array
	],
});
