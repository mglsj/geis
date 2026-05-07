<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiEyeLine, RiEyeOffLine, RiLockPasswordLine } from "remixicon-svelte";
import { resetPasswordSchema, type ResetPasswordType } from "./schema";
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
import { Button } from "$lib/components/shadcn/button";
import { Spinner } from "$lib/components/shadcn/spinner";

interface Props {
	form: SuperValidated<Infer<ResetPasswordType>>;
	callbackURL: string;
}

const { form: defaultForm, callbackURL }: Props = $props();

const form = superForm(defaultForm, {
	validators: zod4Client(resetPasswordSchema),
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await authClient.resetPassword(form.data, {
			onError: ({ error }) => {
				form.valid = false;
				toast.error(
					error.message ?? "An error occurred while resetting password.",
					{
						duration: 3000,
					},
				);
				console.log("Error resetting password:", error);
			},
			onSuccess: () => {
				const redirectTo = getAuthURL("signin", {
					origin: page.url.origin,
					searchParams: {
						callback: callbackURL,
						toast:
							"Password reset successful. Please sign in with your new password.",
					},
				}).toString();

				goto(redirectTo);
			},
		});
	},
});

const { form: formData, enhance, constraints, submitting } = form;
let passwordVisible = $state(false);
</script>

<form method="POST" use:enhance class="space-y-6">
	<Form.Field {form} name="newPassword">
		<Form.Control>
      {#snippet children({ props })}
        <Form.Label>New Password</Form.Label>

        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiLockPasswordLine />
          </InputGroup.Addon>
          <InputGroup.Input
            {...props}
            type={passwordVisible ? "text" : "password"}
            autocomplete="new-password"
            bind:value={$formData.newPassword}
            {...$constraints.newPassword}
        />
		<InputGroup.Addon align="inline-end">
            <Button class="cursor-pointer" variant="ghost" size="icon" type="button" onclick={() => (passwordVisible = !passwordVisible)}>
              {#if passwordVisible}
                <RiEyeOffLine   />
              {:else}
                <RiEyeLine   />
              {/if}
            </Button>
        </InputGroup.Addon>
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>
      Must be at least 6 characters.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  
{#if $submitting}
    <Form.Button class="w-full">
		<Spinner/> Resetting password...
	</Form.Button>
{:else}
	<Form.Button class="w-full cursor-pointer" type="submit">
		Reset Password
	</Form.Button>
{/if}

</form >
