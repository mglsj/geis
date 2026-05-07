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
import QRCode from "qrcode";
import { Skeleton } from "$lib/components/shadcn/skeleton";
import { Code } from "$lib/components/ui/typography";
import { Button } from "$lib/components/shadcn/button";

interface Props {
	twoFactorData: TwoFactorData | null;
}

let { twoFactorData = $bindable() }: Props = $props();

const twoFactorAuthQrSchema = z.object({
	code: z.coerce.string().length(6),
});

const session = authClient.useSession();

let isEnabled = $state(false);

const form = superForm(defaultValues(zod4(twoFactorAuthQrSchema)), {
	validators: zod4Client(twoFactorAuthQrSchema),
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await authClient.twoFactor.verifyTotp(
			{
				code: form.data.code,
			},
			{
				onSuccess: () => {
					toast.success("Two-Factor Authentication enabled successfully!", {
						duration: 5 * 1000,
					});
					isEnabled = true;
					$session.refetch();
				},
				onError: (error) => {
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

{#if isEnabled && twoFactorData}
    <div class="space-y-6">
        <div class="grid grid-cols-2">
            {#each twoFactorData.backupCodes as backupCode}
                <Code>{backupCode}</Code>
            {/each}
        </div>

        <Button variant="outline" 
            onclick={() => twoFactorData = null} 
            class="w-full cursor-pointer"
        >
            Done
        </Button>
    </div>
{:else}
    <form method="POST" use:enhance class="space-y-6">
        <Form.Field {form} name="code"> 
            <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Authentication Code</Form.Label>
                {#if twoFactorData}
                    <img 
                        src={await QRCode.toDataURL(twoFactorData.totpURI)} 
                        alt="QR Code for Two-Factor Authentication" 
                        class="w-48 h-48 mx-auto" 
                    />
                {:else}
                    <Skeleton class="w-48 h-48 mx-auto" />
                {/if}
                <Form.Description>
                    Enter the 6-digit code from your authenticator app to enable two-factor authentication.
                </Form.Description>
                
                <InputGroup.Root>
                    <InputGroup.Addon align="inline-start">
                        <RiLockLine />
                    </InputGroup.Addon>
                    <InputGroup.Input 
                        {...props}
                        type="number"
                        autocomplete="one-time-code"
                        bind:value={$formData.code} 
                        {...$constraints.code} 
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
        <Form.Button class="w-full cursor-pointer" type="submit">
            Enable Two-Factor Authentication
        </Form.Button>
    {/if}
    </form>
{/if}