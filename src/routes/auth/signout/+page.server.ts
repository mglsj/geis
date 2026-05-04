import { getAuthURL } from "$lib/helpers/urls";
import { auth } from "$lib/server/auth";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, request }) => {
	if (!locals.user || !locals.session) {
		throw redirect(302, getAuthURL("signin", {}));
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

	throw redirect(
		302,
		getAuthURL("signin", {
			searchParams: { toast: "Signed out successfully" },
		}),
	);
};
