<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import {
	RiMailLine,
	RiLockPasswordLine,
	RiEyeOffLine,
	RiEyeLine,
} from "remixicon-svelte";
import { signupFormSchema, type SignupFormSchema } from "./schema";
import {
	type SuperValidated,
	type Infer,
	superForm,
	type FormResult,
} from "sveltekit-superforms";
import * as Field from "$lib/components/shadcn/field";
import { zod4Client } from "sveltekit-superforms/adapters";
import { Button } from "$lib/components/shadcn/button";
import type { ActionData } from "./$types";
import { goto } from "$app/navigation";
import { toast } from "svelte-sonner";
import ProfileCard from "$lib/components/ui/ProfileCard.svelte";
import { Spinner } from "$lib/components/shadcn/spinner";
import { authClient } from "$lib/client/auth-client";
import { getAuthURL } from "$lib/helpers/urls";
import { page } from "$app/state";

interface Props {
	form: SuperValidated<Infer<SignupFormSchema>>;
	data: FormResult<ActionData> | null;
}

const { form: defaultForm, data = $bindable() }: Props = $props();

const form = superForm(defaultForm, {
	clearOnSubmit: "none",
	SPA: true,
	validators: zod4Client(signupFormSchema),
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await authClient.signUp.email(
			{
				email: data?.email || "user@example.com",
				name: data?.name || "User",
				password: form.data.password,
				profileId: form.data.profileId,
				callbackURL: form.data.callbackURL,
			},
			{
				onSuccess: () => {
					goto(
						getAuthURL("verify", {
							origin: page.url.origin,
							searchParams: {
								toast: "Sign up successful! Please verify your email.",
								email: data?.email,
								callback: form.data.callbackURL,
							},
						}),
					);
				},
				onError: (error) => {
					form.valid = false;

					console.error("Sign up error:", error);
					toast.error(error.error.message, {
						duration: 5 * 1000,
					});

					switch (error.error.code) {
						case "PROFILE_NOT_FOUND":
							form.errors.profileId = [
								"No profile found with the provided ID. Please contact support.",
							];
							break;
						case "PROFILE_ALREADY_LINKED":
							form.errors.profileId = [
								"This profile is already linked to another account.",
							];
							break;
					}
				},
			},
		);
	},
});

$effect(() => {
	const id = data?.profileId;
	if (!id) return;

	// Race condition fix
	setTimeout(() => {
		$formData.profileId = id;
	}, 100);
});

const { form: formData, enhance, constraints, submitting } = form;

let passwordVisible = $state(false);
</script>

<form method="POST" action="?/signup" use:enhance class="space-y-6">
  <Field.Field>
    <ProfileCard 
        name={data?.name || "User"} 
        username={data?.username || "username"} 
        email={data?.email || "email"}
        image={data?.image}
    />
  </Field.Field>

  <Field.Field>
    <Field.Label>Email</Field.Label>
    <InputGroup.Root>
      <InputGroup.Addon align="inline-start">
        <RiMailLine />
      </InputGroup.Addon>
      <InputGroup.Input 
        type="text"
        autocomplete="off"
        disabled
        value={data?.email ?? ""}
        />
    </InputGroup.Root>
    <Field.Description>Official university email.</Field.Description>
  </Field.Field>
  
  <Form.Field {form} name="password">
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
            bind:value={$formData.password}
            {...$constraints.password}
        />
        <InputGroup.Addon align="inline-end">
            <Button variant="ghost" size="icon" type="button" onclick={() => (passwordVisible = !passwordVisible)}>
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
      Create a new password. Must be at least 6 characters.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>
  
  <input name="profileId" type="hidden" bind:value={$formData.profileId} />
  <input name="callbackURL" type="hidden" bind:value={$formData.callbackURL} />

    {#if $submitting}
      <Form.Button type="submit" disabled class="w-full">
        <Spinner/> Signing up...
      </Form.Button>
    {:else}
      <Form.Button type="submit" class="w-full cursor-pointer">Sign Up</Form.Button>
    {/if}

</form >
