import type { PageLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod4 } from "sveltekit-superforms/adapters";

export const load: PageLoad = async ({ url }) => {
	const email = url.searchParams.get("email") ?? undefined;

	return {
		form: await superValidate({ email }, zod4(formSchema), { errors: false }),
	};
};
