import { auth } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (!locals.user || !locals.session) {
		const redirectTo = new URL("/auth/signin", url.origin);
		throw redirect(302, redirectTo);
	}

	try {
		const result = await auth.api.signOut({
			headers: request.headers,
		});
		if (!result.success) {
			console.error("Unknown error signing out");
		}
	} catch (error) {
		console.error("Error signing out:", error);
	}

	throw redirect(302, "/auth/signin?toast=Signed out successfully");
};
