import { superValidate } from "sveltekit-superforms/client";
import type { PageLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { erpLoginFormSchema, signupFormSchema } from "./schema";

export const load: PageLoad = async ({ parent, url }) => {
	const { callback } = await parent();
	const username = url.searchParams.get("username") ?? undefined;

	return {
		loginForm: await superValidate({ username }, zod4(erpLoginFormSchema), {
			errors: false,
		}),
	};
};
