import type { PageLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageLoad = async ({ url }) => {
	const email = url.searchParams.get("email") ?? undefined;
	const username = url.searchParams.get("username") ?? undefined;

	return {
		email,
		form: await superValidate({ username }, zod4(formSchema), {
			errors: false,
		}),
	};
};
