import { APIError } from "better-auth/api";
import { db } from "$lib/server/db";
import { profile as profileTable } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

const allowedEmailDomains = ["gehu.ac.in"];

export function checkEmailDomainHook(email: string) {
	const domain = email.split("@")[1];

	if (!domain)
		throw new APIError("BAD_REQUEST", {
			code: "INVALID_EMAIL",
			message: "Invalid email address",
		});

	if (!allowedEmailDomains.includes(domain)) {
		throw new APIError("UNPROCESSABLE_ENTITY", {
			code: "INVALID_EMAIL_DOMAIN",
			message: "Only official university email addresses are allowed.",
		});
	}
}

export async function getProfileHook(profileId: string) {
	const result = await db
		.select()
		.from(profileTable)
		.where(eq(profileTable.id, profileId))
		.execute();

	if (!result || result.length === 0) {
		throw new APIError("NOT_FOUND", {
			code: "PROFILE_NOT_FOUND",
			message: "Profile not found",
		});
	}

	return result[0];
}

export async function attachUserToProfileHook(
	profileId: string,
	userId: string,
) {
	const setUserIdResult = await db
		.update(profileTable)
		.set({ userId })
		.where(eq(profileTable.id, profileId))
		.execute();

	if (!setUserIdResult) {
		throw new APIError("INTERNAL_SERVER_ERROR", {
			code: "LINK_PROFILE_FAILED",
			message: "Failed to link user to profile",
		});
	}
}
