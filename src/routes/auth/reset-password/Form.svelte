<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiLockPasswordLine } from "remixicon-svelte";
import { formSchema, type FormSchema } from "./schema";
import {
	type SuperValidated,
	type Infer,
	superForm,
} from "sveltekit-superforms";
import { zod4Client } from "sveltekit-superforms/adapters";
import { authClient } from "$lib/client/auth-client";
import { toast } from "svelte-sonner";
import { getAuthURL } from "$lib/helpers/urls";
import { page } from "$app/state";
import { goto } from "$app/navigation";

interface Props {
	form: SuperValidated<Infer<FormSchema>>;
	callbackURL: string;
}

const { form: defaultForm, callbackURL }: Props = $props();

const form = superForm(defaultForm, {
	validators: zod4Client(formSchema),
	onSubmit: async ({ cancel }) => {
		cancel();
		const { data, error } = await authClient.resetPassword({
			newPassword: $formData.password,
			token: $formData.token,
		});

		if (error) {
			toast.error(
				error.message ?? "An error occurred while resetting password.",
				{
					duration: 3000,
				},
			);
			console.log("Error resetting password:", error);
		} else {
			const redirectTo = getAuthURL("signin", {
				origin: page.url.origin,
				searchParams: {
					callback: callbackURL,
					toast:
						"Password reset successful. Please sign in with your new password.",
				},
			}).toString();

			goto(redirectTo);
		}
	},
});

const { form: formData, enhance, constraints } = form;
</script>

<form method="POST" use:enhance class="space-y-6">
	<Form.Field {form} name="password">
		<Form.Control>
      {#snippet children({ props })}
        <Form.Label>Password</Form.Label>

        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiLockPasswordLine />
          </InputGroup.Addon>
          <InputGroup.Input
            {...props}
            type="password"
            autocomplete="new-password"
            bind:value={$formData.password}
            {...$constraints.password}
        />
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>
      Must be at least 6 characters.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  
  <div class="flex flex-row justify-end">
    <Form.Button type="submit">Reset Password</Form.Button>
  </div>
</form >
