<script lang="ts">
import { authClient } from "$lib/client/auth-client.js";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { toast } from "svelte-sonner";

const { data } = $props();

const { client, scope } = data;

async function handleApprove() {
	await authClient.oauth2.consent(
		{
			accept: true,
			scope: scope,
		},
		{
			onSuccess: (context) => {
				toast.success("Consent approved!");
			},
			onError: (error) => {
				console.error("Error approving consent:", error);
				toast.error(
					error.error.message ?? "An error occurred while approving consent.",
					{
						duration: 5 * 1000,
					},
				);
			},
		},
	);
}

function handleDeny() {
	authClient.oauth2.consent(
		{
			accept: false,
			scope: scope,
		},
		{
			onSuccess: (context) => {
				toast.success("Consent denied!");
			},
			onError: (error) => {
				console.error("Error denying consent:", error);
				toast.error(
					error.error.message ?? "An error occurred while denying consent.",
					{
						duration: 5 * 1000,
					},
				);
			},
		},
	);
}
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Consent</Card.Title>
    <Card.Description><strong>{client.client_name}</strong> wants access to your following data:</Card.Description>
  </Card.Header>

  <Card.Content>
    {#each scope.split(" ") as permission}
      <p>- {permission}</p>
    {/each}
 </Card.Content>

 <Card.Footer class="flex justify-end gap-2">
    <Button variant="outline" size="sm" class="cursor-pointer" onclick={handleDeny}>
        Deny
    </Button>
  <Button variant="default" size="sm" class="cursor-pointer" onclick={handleApprove}>
        Approve
  </Button>
 </Card.Footer>
</Card.Root>