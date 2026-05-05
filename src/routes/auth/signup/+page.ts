import { superValidate } from "sveltekit-superforms/client";
import type { PageLoad } from "./$types";
import { zod4 } from "sveltekit-superforms/adapters";
import { erpLoginFormSchema, signupFormSchema } from "./schema";

export const load: PageLoad = async ({ parent }) => {
	const { callback } = await parent();

	return {
		loginForm: await superValidate({}, zod4(erpLoginFormSchema), {
			errors: false,
		}),
		signupForm: await superValidate(
			{ callbackURL: callback.toString() },
			zod4(signupFormSchema),
			{
				errors: false,
			},
		),
	};
};
