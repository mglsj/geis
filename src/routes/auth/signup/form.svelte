<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiUserLine, RiMailLine, RiLockPasswordLine } from "remixicon-svelte";
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
		const { data, error } = await authClient.signUp.email({
			name: $formData.name,
			email: $formData.email,
			password: $formData.password,
			callbackURL: callbackURL,
		});

		if (error) {
			toast.error(error.message ?? "An error occurred while signing up.", {
				duration: 3000,
			});
			console.log("Error signing up:", error);
		} else {
			if (data.user && !data.token) {
				form.errors.set({
					email: ["Email is already registered."],
				});
				toast.error("Email is already registered.", {
					duration: 3000,
				});
			} else if (!data.user.emailVerified) {
				const verifyEmailURL = getAuthURL("verify", {
					origin: page.url.origin,
					searchParams: {
						callback: callbackURL,
						email: $formData.email,
					},
				});

				await goto(verifyEmailURL);
			} else {
				await goto(callbackURL);
			}
		}
	},
});

const { form: formData, enhance, constraints } = form;

const signInURL = $derived(
	getAuthURL("signin", {
		origin: page.url.origin,
		searchParams: {
			callback: callbackURL,
			email: $formData.email,
		},
	}).toString(),
);
</script>

<form method="POST" use:enhance class="space-y-6">
  <Form.Field {form} name="name">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Name</Form.Label>
        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiUserLine />
          </InputGroup.Addon>
          <InputGroup.Input 
            {...props}
            type="text"
            autocomplete="name"
           bind:value={$formData.name} 
            {...$constraints.name} 
          />
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Please enter your full name.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

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
  
  <div class="flex flex-row justify-between">
    <Button variant="link" size="sm" 
      href={signInURL}
    >
      Already have an account? Sign In
    </Button>
    <Form.Button type="submit">Sign Up</Form.Button>
  </div>
</form >
