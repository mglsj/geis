import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";
import { getAuthURL } from "$lib/helpers/urls";

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	if (locals.user && locals.session) {
		const { callback } = await parent();

		callback.searchParams.set("toast", "Already signed in");

		throw redirect(302, callback);
	}

	const email = url.searchParams.get("email");
	const token = url.searchParams.get("token");

	if (!token) {
		const { callback } = await parent();

		const redirectURL = getAuthURL("forgot-password", {
			origin: url.origin,
			searchParams: {
				callback: callback.toString(),
				toast: "Invalid or expired token",
			},
		});

		throw redirect(302, redirectURL);
	}

	return {
		email,
		form: await superValidate({ token }, zod4(formSchema), { errors: false }),
	};
};
