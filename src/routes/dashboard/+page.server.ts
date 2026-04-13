import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, url }) => {
	if (!locals.user || !locals.session) {
		const redirectTo = new URL("/auth/signin", url.origin);
		redirectTo.searchParams.set("callback", url.pathname + url.search);

		throw redirect(302, redirectTo);
	}
};
