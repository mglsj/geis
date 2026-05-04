<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiMailLine, RiLockPasswordLine, RiUserLine } from "remixicon-svelte";
import { superForm } from "sveltekit-superforms";
import { zod4Client } from "sveltekit-superforms/adapters";
import type { User } from "better-auth";

interface Props {
	user: User;
}

const { user }: Props = $props();

import { z } from "zod";
import { authClient } from "$lib/client/auth-client";

export const formSchema = z.object({
	email: z.email(),
	name: z.string(),
});

const form = superForm(
	{
		email: user.email,
		name: user.name,
	},
	{
		validators: zod4Client(formSchema),
		onSubmit: async ({ cancel }) => {
			cancel();
			// const { data, error } = await authClient.signIn.email({
			// 	email: $formData.email,
			// 	password: $formData.password,
			// 	callbackURL: callbackURL,
			// });
		},
	},
);

const { form: formData, enhance, constraints } = form;
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

 
  
  <div class="flex flex-row justify-end">
 
    <Form.Button type="submit">Update</Form.Button>
  </div>
</form >