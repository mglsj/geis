<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import * as Form from "$lib/components/shadcn/form";
import { z } from "zod";
import { defaults, superForm } from "sveltekit-superforms";
import { zod4, zod4Client } from "sveltekit-superforms/adapters";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { Spinner } from "$lib/components/shadcn/spinner";
import { onMount } from "svelte";
import { RiMailLine } from "remixicon-svelte";
import { toast } from "svelte-sonner";

const formSchema = z.object({
	email: z.email(),
	callbackURL: z.url(),
});

interface Props {
	email: string;
	callbackURL: string;
}

let { email = $bindable(), callbackURL }: Props = $props();

const form = superForm(
	defaults(
		{
			email,
			callbackURL,
		},
		zod4(formSchema),
	),
	{
		validators: zod4Client(formSchema),
		clearOnSubmit: "none",
		SPA: true,
		onUpdate: async ({ form }) => {
			if (!form.valid) return;

			await authClient.sendVerificationEmail(
				{
					email: form.data.email,
					callbackURL: form.data.callbackURL,
				},
				{
					onSuccess: () => {
						email = form.data.email;

						startEmailVerificationCountdown();

						toast.info("Verification email resent. Please check your inbox.", {
							duration: 5 * 1000,
						});
					},
					onError: (error) => {
						form.valid = false;

						console.error("Error resending verification email:", error);
						toast.error(
							error.error.message ??
								"An error occurred while resending the verification email.",
							{
								duration: 5 * 1000,
							},
						);
					},
				},
			);
		},
	},
);

const { form: formData, enhance, constraints, submitting } = form;

let interval: NodeJS.Timeout;
let timeToNextResend = $state(30);

onMount(() => {
	startEmailVerificationCountdown();
});

function startEmailVerificationCountdown(time = 30) {
	timeToNextResend = time;

	interval = setInterval(() => {
		timeToNextResend -= 1;
		if (timeToNextResend <= 0) {
			clearInterval(interval);
		}
	}, 1000);
}
</script>

<form use:enhance class="space-y-6">
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
        <Form.Description>Must be a valid university email address.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>

    <input type="hidden" name="callbackURL" bind:value={$formData.callbackURL} />

    {#if $submitting}
      <Form.Button type="submit" disabled class="w-full">
        <Spinner/> Signing up...
      </Form.Button>
    {:else}
        <Form.Button type="submit" class="w-full cursor-pointer" disabled={timeToNextResend > 0}>
            Resend Verification Email {timeToNextResend > 0 ? `(${timeToNextResend}s)` : ""}
        </Form.Button>
    {/if}

</form>