<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import { H1 } from "$lib/components/ui/typography";
import * as Card from "$lib/components/shadcn/card";
import { Button } from "$lib/components/shadcn/button";
import { toast } from "svelte-sonner";

async function getClients() {
	const { data, error } = await authClient.oauth2.getClients();

	if (error) {
		throw error;
	}

	return data;
}
</script>

<H1>OAuth Clients</H1>

{#await getClients()}
    <p>Loading...</p>
{:then clients}
    {#each clients as client}
        <Card.Root class="w-full">
            <Card.Header>
                <Card.Title>{client.client_name}</Card.Title>
                <Card.Description>Client ID: {client.client_id}</Card.Description>
            </Card.Header>
            <Card.Content>
            <div class="w-full flex justify-between">
                <div>
                    <p><strong>Redirect URIs:</strong></p>
                    <ul class="list-disc list-inside">
                        {#each client.redirect_uris as uri}
                            <li>{uri}</li>
                        {/each}
                    </ul>
                </div>

                <Button variant="destructive" class="cursor-pointer" onclick={async ()=> {
                    if (confirm("Are you sure you want to delete this client? This action cannot be undone.")) {
                        await authClient.oauth2.deleteClient({
                            client_id: client.client_id
                        },{
                            onSuccess: () => {
                                toast.info("Client deleted successfully");
                                location.reload();
                            },
                            onError: (error) => {
                                toast.error("Error deleting client: " + error.error.message);
                            }
                        });
                    }
                }}>
                    Delete
                </Button>
            </div>
         
            </Card.Content>
        </Card.Root>
    {/each}
{:catch error}
    <p class="text-destructive">Error: {error.message}</p>
{/await}

<div class="w-full flex justify-end">
    <Button href="/developer/new" >
        Register New Client
    </Button>
</div>