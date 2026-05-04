import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getAuthURL } from "$lib/helpers/urls";

export const load: PageServerLoad = async ({ url }) => {
	return redirect(
		308,
		getAuthURL("signin", {
			origin: url.origin,
		}),
	);
};
