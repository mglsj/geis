<script lang="ts">
import { defaultValues, superForm } from "sveltekit-superforms";
import { zod4, zod4Client } from "sveltekit-superforms/adapters";
import * as Form from "$lib/components/shadcn/form";
import z from "zod";
import * as InputGroup from "$lib/components/shadcn/input-group";
import { RiLockLine } from "remixicon-svelte";
import { Checkbox } from "$lib/components/shadcn/checkbox";
import { Spinner } from "$lib/components/shadcn/spinner";
import { authClient } from "$lib/client/auth-client";
import { toast } from "svelte-sonner";

const session = authClient.useSession();

const changePasswordSchema = z.object({
	currentPassword: z.string().min(6),
	newPassword: z.string().min(6),
	revokeOtherSessions: z.boolean().default(true),
});

const form = superForm(defaultValues(zod4(changePasswordSchema)), {
	validators: zod4Client(changePasswordSchema),
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		await authClient.changePassword(form.data, {
			onSuccess: () => {
				toast.success("Password changed successfully!", {
					duration: 3000,
				});
			},
			onError: ({ error }) => {
				form.valid = false;

				switch (error.code) {
					case "INVALID_PASSWORD": {
						form.errors.currentPassword = [
							"The current password is incorrect.",
						];
						break;
					}
					case "WEAK_PASSWORD": {
						form.errors.newPassword = ["The new password is too weak."];
						break;
					}
					default:
						console.error("Error changing password:", error);
				}

				toast.error(
					error.message || "An error occurred while changing the password.",
					{
						duration: 3000,
					},
				);
			},
		});
	},
});

const { form: formData, enhance, constraints, submitting } = form;
</script>

<form method="POST" use:enhance class="space-y-6">
    <input type="hidden" name="username" autocomplete="username" value={$session?.data?.user.username} />

    <Form.Field {form} name="currentPassword"> 
        <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Current Password</Form.Label>
            <InputGroup.Root>
                <InputGroup.Addon align="inline-start">
                    <RiLockLine />
                </InputGroup.Addon>
                <InputGroup.Input 
                    {...props}
                    type="password"
                    autocomplete="current-password"
                    bind:value={$formData.currentPassword} 
                    {...$constraints.currentPassword} 
                />
            </InputGroup.Root>
        {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="newPassword"> 
        <Form.Control>
        {#snippet children({ props })}
            <Form.Label>New Password</Form.Label>
            <InputGroup.Root>
                <InputGroup.Addon align="inline-start">
                    <RiLockLine />
                </InputGroup.Addon>
                <InputGroup.Input 
                    {...props}
                    type="password"
                    autocomplete="new-password"
                    bind:value={$formData.newPassword} 
                    {...$constraints.newPassword} 
                />
            </InputGroup.Root>
        {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="revokeOtherSessions"> 
        <Form.Control>
        {#snippet children({ props })}
            <div class="flex items-center gap-2 mb-2">
            <Checkbox 
                {...props}
                bind:checked={$formData.revokeOtherSessions} 
            />
            <Form.Label>Revoke Other Sessions</Form.Label>
            </div>
        {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>

{#if $submitting}
    <Form.Button class="w-full" >
		<Spinner/> Changing password...
	</Form.Button>
{:else}
	<Form.Button class="w-full cursor-pointer" type="submit">
        Change Password
    </Form.Button>
{/if}
</form>