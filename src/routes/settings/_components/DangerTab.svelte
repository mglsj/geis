<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { RiDeleteBinFill } from "remixicon-svelte";
import { toast } from "svelte-sonner";

async function deleteAccount() {
	await authClient.deleteUser(
		{
			callbackURL: "/",
		},
		{
			onSuccess: () => {
				toast.success(
					"Confirmation email sent. Please check your inbox to complete the account deletion process.",
					{
						duration: 5 * 1000,
					},
				);
			},
			onError: (error) => {
				console.error("Error deleting account:", error);
				toast.error("Failed to delete account. Please try again later.", {
					duration: 5 * 1000,
				});
			},
		},
	);
}
</script>

<Card.Root class="border border-destructive w-sm max-w-sm mx-auto">
    <Card.Header>
        <Card.Title class="text-destructive">Delete Account</Card.Title>
        <Card.Description class="text-destructive">
            This action is irreversible. Please proceed with caution.
        </Card.Description>
    </Card.Header>
    <Card.Content>
        <Button variant="destructive" class="cursor-pointer w-full"
            onclick={deleteAccount}
        >
            <RiDeleteBinFill />
            Delete Account Permanently
        </Button>
    </Card.Content>
</Card.Root>
