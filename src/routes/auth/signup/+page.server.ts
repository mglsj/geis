import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals, parent, url }) => {
	if (locals.user && locals.session) {
		const { callback } = await parent();

		callback.searchParams.set("toast", "Already signed in");

		throw redirect(302, callback);
	}

	const email = url.searchParams.get("email") ?? undefined;

	return {
		form: await superValidate({ email }, zod4(formSchema), { errors: false }),
	};
};
