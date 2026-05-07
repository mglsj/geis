<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import * as Card from "$lib/components/shadcn/card";
import {
	SUPPORTED_OAUTH_PROVIDER_DETAILS,
	SUPPORTED_OAUTH_PROVIDERS,
	type SupportedOAuthProvider,
} from "$lib/client/oauth";
import { H3, Muted } from "$lib/components/ui/typography";
import Button from "$lib/components/shadcn/button/button.svelte";
import { RiAddLine, RiDeleteBinLine } from "remixicon-svelte";
import { toast } from "svelte-sonner";
import { page } from "$app/state";

type AccountsResponse = Awaited<ReturnType<typeof authClient.listAccounts>>;
type Account = NonNullable<AccountsResponse["data"][number]>;

interface Props {
	accounts: Account[];
}

const { accounts }: Props = $props();

const otherProviders = $derived(
	SUPPORTED_OAUTH_PROVIDERS.filter(
		(provider) => !accounts.some((a) => a.providerId === provider),
	),
);

function linkAccount(provider: SupportedOAuthProvider) {
	return authClient.linkSocial(
		{
			provider,
			callbackURL: page.url.pathname,
		},
		{
			onError: (error) => {
				console.error("Error linking account:", error);
				toast.error(`Failed to link account: ${error.error.message}`);
			},
		},
	);
}

function unlinkAccount(providerId: SupportedOAuthProvider, accountId: string) {
	return authClient.unlinkAccount(
		{ accountId, providerId },
		{
			onSuccess: () => {
				// Optionally, you can show a success message or refresh the accounts list
			},
			onError: (error) => {
				console.error("Error unlinking account:", error);
				toast.error(`Failed to unlink account: ${error.error.message}`);
			},
		},
	);
}
</script>


{#snippet accountCard(provider:SupportedOAuthProvider, account?:Account)}
    {@const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[provider]}

    <Card.Root class="w-full">
        <Card.Header>
            <Card.Title class="flex items-center gap-2">
                <providerDetails.Icon class="w-5 h-5" />
                {providerDetails.name}
            </Card.Title>
            <Card.Description>
                {#if account}
                    Linked on {new Date(account.createdAt).toLocaleDateString()}
                {:else}
                    Connect your {providerDetails.name} account.
                {/if}
            </Card.Description>
            <Card.Action>
                {#if account}
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        class="cursor-pointer" 
                        onclick={() => unlinkAccount(provider, account.accountId)}
                    >
                        <RiDeleteBinLine />
                    </Button>
                {:else}
                    <Button 
                        variant="default" 
                        size="icon" 
                        class="cursor-pointer"
                        onclick={() => linkAccount(provider)}
                    >
                        <RiAddLine />
                    </Button>
                {/if}
            </Card.Action>
        </Card.Header>
    </Card.Root>    
{/snippet}


{#if accounts.length > 0}
    {#each accounts as account}
        {@render accountCard(account.providerId, account)}
    {/each}
{:else}
    <Muted>No linked accounts found.</Muted>
{/if}


{#if otherProviders.length > 0}
    <H3>Available Accounts</H3>

    {#each otherProviders as provider}
        {@render accountCard(provider)}
    {/each}
{:else}
    <Muted>No accounts to link.</Muted>
{/if}


