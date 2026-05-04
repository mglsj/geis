import { getAuthURL } from "$lib/helpers/urls";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

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
};
