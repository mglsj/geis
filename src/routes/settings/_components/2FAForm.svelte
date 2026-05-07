<script lang="ts">
import { defaultValues, superForm } from "sveltekit-superforms";
import { zod4, zod4Client } from "sveltekit-superforms/adapters";
import * as Form from "$lib/components/shadcn/form";
import z from "zod";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiLockLine } from "remixicon-svelte";
import { Spinner } from "$lib/components/shadcn/spinner";
import { authClient } from "$lib/client/auth-client";
import { toast } from "svelte-sonner";
import type { TwoFactorData } from "./2FA.svelte";

interface Props {
	twoFactorData: TwoFactorData | null;
}

let { twoFactorData = $bindable() }: Props = $props();

const session = authClient.useSession();

const twoFactorAuthFormSchema = z.object({
	password: z.string().min(6),
});

type TwoFactorAuthFormData = z.infer<typeof twoFactorAuthFormSchema>;

async function enableTwoFactor(formData: TwoFactorAuthFormData) {
	const { data, error } = await authClient.twoFactor.enable({
		password: formData.password,
		issuer: "Graphic Era Identity Service (GEIS)",
	});

	if (error) {
		toast.error(
			error.message ||
				"An error occurred while enabling Two-Factor Authentication.",
			{
				duration: 5 * 1000,
			},
		);
		form.reset();
		return;
	}

	form.reset();
	twoFactorData = data;
}

async function disableTwoFactor(formData: TwoFactorAuthFormData) {
	await authClient.twoFactor.disable(
		{
			password: formData.password,
		},
		{
			onSuccess: () => {
				toast.success("Two-Factor Authentication disabled successfully!", {
					duration: 5 * 1000,
				});
				$session.refetch();
			},
			onError: ({ error }) => {
				toast.error(
					error.message ||
						"An error occurred while disabling Two-Factor Authentication.",
					{
						duration: 5 * 1000,
					},
				);
			},
		},
	);
}

const form = superForm(defaultValues(zod4(twoFactorAuthFormSchema)), {
	validators: zod4Client(twoFactorAuthFormSchema),
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		if ($session.data?.user.twoFactorEnabled) {
			await disableTwoFactor(form.data);
		} else {
			await enableTwoFactor(form.data);
		}
	},
});

const { form: formData, enhance, constraints, submitting } = form;
</script>


<form method="POST" use:enhance class="space-y-6">
    <input type="hidden" name="username" autocomplete="username" value={$session?.data?.user.username} />

    <Form.Field {form} name="password"> 
        <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Password</Form.Label>
            <InputGroup.Root>
                <InputGroup.Addon align="inline-start">
                    <RiLockLine />
                </InputGroup.Addon>
                <InputGroup.Input 
                    {...props}
                    type="password"
                    autocomplete="current-password"
                    bind:value={$formData.password} 
                    {...$constraints.password} 
                />
            </InputGroup.Root>
        {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

{#if $submitting}
    <Form.Button class="w-full" >
		<Spinner/> Processing...
	</Form.Button>
{:else}
	
	{#if $session.data?.user.twoFactorEnabled}
		<Form.Button variant="destructive" class="w-full cursor-pointer" type="submit">
			Disable Two-Factor Authentication
		</Form.Button>
	{:else}
		<Form.Button class="w-full cursor-pointer" type="submit">
			Enable Two-Factor Authentication
		</Form.Button>
	{/if}
  
{/if}
</form>