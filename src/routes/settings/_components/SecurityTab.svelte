<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import * as Card from "$lib/components/shadcn/card";
import { Skeleton } from "$lib/components/shadcn/skeleton";
import ChangePasswordForm from "./ChangePasswordForm.svelte";
import H3 from "$lib/components/ui/typography/H3.svelte";
import SetPassword from "./SetPassword.svelte";
import { Badge } from "$lib/components/shadcn/badge";
import TwoFactorAuth from "./2FA.svelte";

async function hasPassword() {
	const { data, error } = await authClient.listAccounts();

	if (error) {
		throw error;
	}

	return data.some((account) => account.providerId === "credential");
}

const session = authClient.useSession();
</script>

<H3>Password</H3>

{#await hasPassword()}
    <Card.Root class="w-sm max-w-sm mx-auto">
        <Card.Header>
            <Card.Title>Checking Password...</Card.Title>        
        </Card.Header>
        <Card.Content>
            <Skeleton class="w-full h-10" />
        </Card.Content>
    </Card.Root>
{:then hasPass}
    {#if hasPass} 
        <Card.Root class="w-sm max-w-sm mx-auto">
            <Card.Header>
                <Card.Title>Change Password</Card.Title>
                <Card.Description>
                    Update your password for improved security. 
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <ChangePasswordForm />
            </Card.Content>
        </Card.Root>

        <H3>Two-Factor Authentication</H3>

        <Card.Root class="w-sm max-w-sm mx-auto">
            <Card.Header class="flex items-center justify-between gap-2">
                <Card.Title>Two-Factor Authentication</Card.Title>
                <Badge
                    variant={$session.data?.user.twoFactorEnabled ? "default" : "secondary"}
                    class="ml-2"
                >
                    { $session.data?.user.twoFactorEnabled ? "Enabled" : "Disabled" }
                </Badge>
            </Card.Header>
            <Card.Content>
                <TwoFactorAuth />
            </Card.Content>
        </Card.Root>
    {:else}
        <Card.Root class="w-sm max-w-sm mx-auto">
            <Card.Header>
                <Card.Title>Set Password</Card.Title>
                <Card.Description>
                    A password reset link will be sent to your email address.
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <SetPassword />
            </Card.Content>    
        </Card.Root>
    {/if}
{:catch error}
    <Card.Root class="w-sm max-w-sm mx-auto">
        <Card.Content>
            <p class="text-destructive">
                Error checking password: {error.message}
            </p>
        </Card.Content>
    </Card.Root>
{/await} 
