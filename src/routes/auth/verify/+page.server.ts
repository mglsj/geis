import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	if (locals.user?.emailVerified) {
		const { callback } = await parent();

		callback.searchParams.set("toast", "Already verified!");

		throw redirect(302, callback);
	}

	const email = url.searchParams.get("email");

	// if (!email) {
	// 	const { callback } = await parent();

	// 	const redirectURL = getAuthURL("signin", {
	// 		origin: url.origin,
	// 		searchParams: {
	// 			callback: callback.toString(),
	// 			toast: "Email is required",
	// 		},
	// 	});

	// 	throw redirect(302, redirectURL);
	// }

	return {
		email,
	};
};
