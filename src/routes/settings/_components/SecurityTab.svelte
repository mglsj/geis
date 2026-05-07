<script lang="ts">
import { page } from "$app/state";
import { authClient } from "$lib/client/auth-client";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { Skeleton } from "$lib/components/shadcn/skeleton";
import { getAuthURL } from "$lib/helpers/urls";
import { toast } from "svelte-sonner";
import ChangePasswordForm from "./ChangePasswordForm.svelte";

async function hasPassword() {
	const { data, error } = await authClient.listAccounts();

	if (error) {
		throw error;
	}

	return data.some((account) => account.providerId === "credential");
}

const session = authClient.useSession();
</script>

<Card.Root class="w-sm max-w-sm mx-auto">
    {#await hasPassword()}
        <Card.Header>
            <Card.Title>Checking Password...</Card.Title>        
        </Card.Header>
        <Card.Content>
            <Skeleton class="w-full h-10" />
        </Card.Content>
    {:then hasPass}

        {#if hasPass}
            <Card.Header>
                <Card.Title>Change Password</Card.Title>
                <Card.Description>
                    Update your password for improved security. 
                </Card.Description>
            </Card.Header>
            <Card.Content>
                <ChangePasswordForm />
            </Card.Content>
        {:else}
            <Card.Header>
                <Card.Title>Set Password</Card.Title>
                <Card.Description>
                    A password reset link will be sent to your email address.
                </Card.Description>
            </Card.Header>

            <Card.Content>
                <Button onclick={async () => {
                    const { error } = await authClient.requestPasswordReset({
                                email: $session.data?.user.email || "",
                                redirectTo: getAuthURL("reset-password", {
                                    origin: page.url.origin,
                                    searchParams: {
                                        callback: page.url.pathname,
                                        email: $session.data?.user.email || "",
                                    },
                                }).toString(),
                            });

                            if (error) {
                                toast.error(
                                    error.message ?? "An error occurred while resetting password.",
                                    {
                                        duration: 3000,
                                    },
                                );
                                console.log("Error resetting password:", error);
                            } else {
                                toast.success("Password reset email sent. Please check your inbox.", {
                                    duration: 3000,
                                });
                            }
                }}>Send Reset Link</Button>
            </Card.Content>         
        {/if}
    {:catch error}
        <Card.Content>
            <p class="text-destructive">
                Error checking password: {error.message}
            </p>
        </Card.Content>
    {/await} 
</Card.Root>