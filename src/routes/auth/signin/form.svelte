<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiMailLine, RiLockPasswordLine } from "remixicon-svelte";
import { formSchema, type FormSchema } from "./schema";
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

interface Props {
	form: SuperValidated<Infer<FormSchema>>;
	callbackURL: string;
}

const { form: defaultForm, callbackURL }: Props = $props();

const form = superForm(defaultForm, {
	validators: zod4Client(formSchema),
	onSubmit: async ({ cancel }) => {
		cancel();
		const { data, error } = await authClient.signIn.email({
			email: $formData.email,
			password: $formData.password,
			callbackURL: callbackURL,
		});

		if (error) {
			toast.error(error.message ?? "An error occurred while signing in.", {
				duration: 3000,
			});
			console.log("Error signing in:", error);

			switch (error.code) {
				case "INVALID_EMAIL_OR_PASSWORD": {
					form.errors.set({
						email: ["Invalid email or password"],
						password: ["Invalid email or password"],
					});
					break;
				}
				case "EMAIL_NOT_VERIFIED": {
					const verifyEmailURL = getAuthURL("verify", {
						origin: page.url.origin,
						searchParams: {
							callback: callbackURL,
							email: $formData.email,
						},
					});

					await goto(verifyEmailURL);
					break;
				}
				case "INVALID_CALLBACK_URL": {
				}
			}
		} else {
			if (data.redirect && data.url) {
				await goto(data.url);
			} else {
				await goto(callbackURL);
			}
		}
	},
});

const { form: formData, enhance, constraints } = form;

const signUpURL = $derived(
	getAuthURL("signup", {
		origin: page.url.origin,
		searchParams: {
			callback: callbackURL,
		},
	}).toString(),
);

const forgotPasswordURL = $derived(
	getAuthURL("forgot-password", {
		origin: page.url.origin,
		searchParams: {
			callback: callbackURL,
			email: $formData.email,
		},
	}).toString(),
);
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
            autocomplete="email webauthn"
           bind:value={$formData.email} 
            {...$constraints.email} 
          />
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Must be the university email.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
      <div class="flex items-center justify-between">
        <Form.Label>Password</Form.Label>
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
            type="password"
            autocomplete="current-password webauthn"
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
  
  <div class="flex flex-row justify-between">
    <Button variant="link" size="sm" 
      href={signUpURL}
    >
      Don't have an account? Sign Up
    </Button>
    <Form.Button type="submit">Sign In</Form.Button>
  </div>
</form >
