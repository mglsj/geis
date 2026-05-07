<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import { superForm, defaults } from "sveltekit-superforms";
import { zod4, zod4Client } from "sveltekit-superforms/adapters";
import { goto } from "$app/navigation";
import { Spinner } from "$lib/components/shadcn/spinner";
import z from "zod";
import * as InputOTP from "$lib/components/shadcn/input-otp";
import { toast } from "svelte-sonner";
import { authClient } from "$lib/client/auth-client";
import { Checkbox } from "$lib/components/shadcn/checkbox";

const totpSchema = z.object({
	code: z.coerce.string().length(6),
	trustDevice: z.boolean().default(true),
});

interface Props {
	callbackURL: string;
}

const { callbackURL }: Props = $props();

const form = superForm(defaults(zod4(totpSchema)), {
	validators: zod4Client(totpSchema),
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await authClient.twoFactor.verifyTotp(
			{
				code: form.data.code,
				trustDevice: form.data.trustDevice,
			},
			{
				onSuccess: async () => {
					toast.success("Two-Factor Authentication successful!", {
						duration: 5 * 1000,
					});
					await goto(callbackURL);
				},
				onError: async (error) => {
					console.error("Error verifying TOTP code:", error);
					toast.error(
						error.error.message ||
							"An error occurred while verifying the authentication code.",
						{
							duration: 5 * 1000,
						},
					);
				},
			},
		);
	},
});

const { form: formData, enhance, constraints, submitting } = form;
</script>

<form method="POST" use:enhance class="space-y-6">
	<Form.Field {form} name="code">
		<Form.Control>
      {#snippet children({ props })}
        <Form.Label>Two-Factor Code</Form.Label>
        <div class="w-full flex items-center justify-center">
            <InputOTP.Root 
                maxlength={6} 
                {...props} 
                bind:value={$formData.code} 
                {...$constraints.code} 
            >
                {#snippet children({ cells })}
                <InputOTP.Group>
                    {#each cells as cell (cell)}
                    <InputOTP.Slot {cell} />
                    {/each}
                </InputOTP.Group>
                {/snippet}
            </InputOTP.Root>
            </div>
      {/snippet}
    </Form.Control>
    <Form.Description>
      Must be at least 6 characters.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="trustDevice"> 
    <Form.Control>
    {#snippet children({ props })}
        <div class="flex items-center gap-2 mb-2">
        <Checkbox 
            {...props}
            bind:checked={$formData.trustDevice} 
        />
        <Form.Label>Trust this device for 30 days.</Form.Label>
        </div>
    {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  
{#if $submitting}
    <Form.Button class="w-full">
		<Spinner/> Verifying...
	</Form.Button>
{:else}
	<Form.Button class="w-full cursor-pointer" type="submit">
		Verify
	</Form.Button>
{/if}

</form >
