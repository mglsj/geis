<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiMailLine } from "remixicon-svelte";
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
import { Spinner } from "$lib/components/shadcn/spinner";

interface Props {
	form: SuperValidated<Infer<FormSchema>>;
	callbackURL: string;
	signInURL: string;
}

let {
	form: defaultForm,
	callbackURL,
	signInURL = $bindable(),
}: Props = $props();

const form = superForm(defaultForm, {
	validators: zod4Client(formSchema),
	onSubmit: async ({ cancel }) => {
		cancel();
		const { error } = await authClient.requestPasswordReset({
			email: $formData.email,
			redirectTo: getAuthURL("reset-password", {
				origin: page.url.origin,
				searchParams: {
					callback: callbackURL,
					email: $formData.email,
				},
			}).toString(),
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
			toast.success("Password reset email sent. Please check your inbox.", {
				duration: 3000,
			});
		}
	},
});

const { form: formData, enhance, constraints, submitting } = form;

$effect(() => {
	signInURL = getAuthURL("signin", {
		origin: page.url.origin,
		searchParams: {
			callback: callbackURL,
			email: $formData.email,
		},
	}).toString();
});
</script>

<form method="POST" use:enhance class="space-y-6">
  <Form.Field {form} name="email">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Email</Form.Label>
        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiMailLine />
          </InputGroup.Addon>
          <InputGroup.Input 
            {...props}
            type="email"
            autocomplete="email"
            bind:value={$formData.email} 
            {...$constraints.email} 
          />
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Must be the university email.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

{#if $submitting}
    <Form.Button class="w-full" type="submit" disabled>
		<Spinner/> Sending...
	</Form.Button>
{:else}
	<Form.Button type="submit" class="w-full cursor-pointer">Send Reset Link</Form.Button>
{/if}

</form >
