<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import {
	RiLockPasswordLine,
	RiEyeOffLine,
	RiEyeLine,
	RiUserLine,
} from "remixicon-svelte";
import { signInSchema, type SignInFormData } from "./schema";
import {
	type SuperValidated,
	type Infer,
	superForm,
} from "sveltekit-superforms";
import { zod4Client } from "sveltekit-superforms/adapters";
import { Button } from "$lib/components/shadcn/button";
import { goto } from "$app/navigation";
import { authClient } from "$lib/client/auth-client";
import { toast } from "svelte-sonner";
import { getAuthURL } from "$lib/helpers/urls";
import { page } from "$app/state";
import { Spinner } from "$lib/components/shadcn/spinner";

interface Props {
	form: SuperValidated<Infer<SignInFormData>>;
	callback: string;
	username?: string;
}

let { form: defaultForm, callback, username = $bindable() }: Props = $props();

const form = superForm(defaultForm, {
	validators: zod4Client(signInSchema),
	clearOnSubmit: "none",
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await authClient.signIn.username(
			{
				username: $formData.username,
				password: $formData.password,
				rememberMe: true,
				callbackURL: callback,
			},
			{
				onSuccess: async (context) => {
					console.log("Successfully signed in:", context);
					if (context.data.twoFactorRedirect) {
						await goto(
							getAuthURL("2fa", {
								origin: page.url.origin,
								searchParams: page.url.searchParams,
							}),
						);
					} else {
						await goto(callback);
					}
				},
				onError: async (error) => {
					form.valid = false;

					toast.error(
						error.error.message ?? "An error occurred while signing in.",
						{
							duration: 10 * 1000,
						},
					);
					console.log("Error signing in:", error);

					switch (error.error.code) {
						case "INVALID_USERNAME_OR_PASSWORD": {
							form.errors.username = ["Invalid username or password"];
							form.errors.password = ["Invalid username or password"];
							break;
						}
						case "EMAIL_NOT_VERIFIED": {
							const verifyEmailURL = getAuthURL("verify", {
								origin: page.url.origin,
								searchParams: {
									callback: callback,
								},
							});

							return goto(verifyEmailURL);
						}
					}
				},
			},
		);
	},
});

const { form: formData, enhance, constraints, submitting } = form;

const forgotPasswordURL = $derived(
	getAuthURL("forgot-password", {
		origin: page.url.origin,
		searchParams: {
			callback: callback,
		},
	}).toString(),
);

let passwordVisible = $state(false);

$effect(() => {
	username = $formData.username;
});
</script>

<form method="POST" use:enhance class="space-y-6">
  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Student ID</Form.Label>
        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiUserLine />
          </InputGroup.Addon>
          <InputGroup.Input 
            {...props}
            type="number"
            autocomplete="username webauthn"
           bind:value={$formData.username} 
            {...$constraints.username} 
          />
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Must be the university student ID.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
      <div class="flex items-center justify-between">
        <Form.Label>GEIS Password</Form.Label>
        <Button variant="link" 
          href={forgotPasswordURL}
          size="sm" class="ml-auto"
        >
          Forgot Password?
        </Button>
      </div>
        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiLockPasswordLine />
          </InputGroup.Addon>
          <InputGroup.Input
            {...props}
            type={passwordVisible ? "text" : "password"}
            autocomplete="current-password webauthn"
            bind:value={$formData.password}
            {...$constraints.password}
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
    <Form.Button class="w-full" type="submit" disabled>
		<Spinner/> Signing in...
	</Form.Button>
{:else}
     <Form.Button class="w-full cursor-pointer" type="submit">Sign In</Form.Button>
{/if}

</form >
