import { getAuthURL } from "$lib/helpers/urls";
import { db } from "$lib/server/db";
import { profile as profileTable } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user || !locals.session) {
		throw redirect(
			302,
			getAuthURL("signin", {
				origin: url.origin,
				searchParams: { callback: url.toString() },
			}).toString(),
		);
	}

	const results = await db
		.select()
		.from(profileTable)
		.where(eq(profileTable.userId, locals.user.id));

	if (results.length > 0) {
		return {
			profile: results[0],
		};
	}
};
