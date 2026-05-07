<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import * as Card from "$lib/components/shadcn/card";
import { Skeleton } from "$lib/components/shadcn/skeleton";
import AccountManagement from "./AccountManagement.svelte";

type AccountsResponse = Awaited<ReturnType<typeof authClient.listAccounts>>;
type Account = NonNullable<AccountsResponse["data"][number]>;

async function getLinkedAccounts(): Promise<Account[]> {
	const { data, error } = await authClient.listAccounts();

	if (error) {
		throw error;
	}

	return data.filter((account) => account.providerId !== "credential");
}
</script>


{#await getLinkedAccounts()}
    <Card.Root class="w-sm max-w-sm mx-auto">
        <Card.Header>
            <Card.Title>Getting Accounts...</Card.Title>        
        </Card.Header>
        <Card.Content>
            <Skeleton class="w-full h-10" />
        </Card.Content>
    </Card.Root>
{:then accounts}
    <AccountManagement {accounts}/>
{:catch error}
    <Card.Root class="w-sm max-w-sm mx-auto">
        <Card.Content>
                <p class="text-destructive">
                    Error getting accounts: {error.message}
                </p>
        </Card.Content>
    </Card.Root>
{/await}