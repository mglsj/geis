<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import * as Card from "$lib/components/shadcn/card";
import { Skeleton } from "$lib/components/shadcn/skeleton";
import SessionManagement from "./SessionManagement.svelte";

async function getSessions() {
	const { data, error } = await authClient.listSessions();

	if (error) {
		throw error;
	}

	return data;
}

const session = authClient.useSession();
</script>

{#await getSessions()}
    <Card.Root class="w-sm max-w-sm mx-auto">
        <Card.Header>
            <Card.Title>Getting Sessions...</Card.Title>        
        </Card.Header>
        <Card.Content>
            <Skeleton class="w-full h-10" />
        </Card.Content>
    </Card.Root>

{:then sessions}
    <SessionManagement {sessions} currentSessionToken={$session.data?.session.token || ""} {getSessions}/>
{:catch error}
    <Card.Root class="w-sm max-w-sm mx-auto">
        <Card.Content>
                <p class="text-destructive">
                    Error getting sessions: {error.message}
                </p>
        </Card.Content>
    </Card.Root>
{/await} 