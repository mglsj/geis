<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import Header from "$lib/components/ui/Header.svelte";
import { Button } from "$lib/components/shadcn/button";
import {
	RiArrowLeftLine,
	RiDeleteBinFill,
	RiDeleteBinLine,
	RiKeyFill,
	RiKeyLine,
	RiLinksFill,
	RiLinksLine,
	RiShieldFill,
	RiShieldLine,
} from "remixicon-svelte";
import * as Tabs from "$lib/components/shadcn/tabs";

import ProfileCard from "$lib/components/ui/ProfileCard.svelte";
import { H1, H2 } from "$lib/components/ui/typography";
import SecurityTab from "./_components/SecurityTab.svelte";
import SessionsTab from "./_components/SessionsTab.svelte";
import AccountsTab from "./_components/AccountsTab.svelte";
import DangerTab from "./_components/DangerTab.svelte";

const session = authClient.useSession();

let tabValue: string = $state("security");
</script>

<Header/>

<main class="p-4 mx-auto max-w-2xl gap-4 flex flex-col align-start items-start">
    <Button variant="link" href="/">
        <RiArrowLeftLine />
        Back to Home
    </Button>

    <H1>
        Settings
    </H1>

    <ProfileCard 
        name={$session.data?.user.name || "User"} 
        username={$session.data?.user.username || "username"} 
        email={$session.data?.user.email || "email"} 
        image={$session.data?.user.image} 
    />

    <Tabs.Root bind:value={tabValue} class="w-full gap-4">
    
    <Tabs.List class="mx-auto">
        <Tabs.Trigger value="security">
            {#if tabValue === "security"}
                <RiShieldFill />
            {:else}
                <RiShieldLine />
            {/if}
            <span class="max-sm:hidden">Security</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="sessions">
            {#if tabValue === "sessions"}
                <RiKeyFill />
            {:else}
                <RiKeyLine />
            {/if}
            <span class="max-sm:hidden">Sessions</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="accounts">
            {#if tabValue === "accounts"}
                <RiLinksFill />
            {:else}
                <RiLinksLine />
            {/if}
            <span class="max-sm:hidden">Accounts</span>
        </Tabs.Trigger>
        <Tabs.Trigger value="danger">
            {#if tabValue === "danger"}
                <RiDeleteBinFill />
            {:else}
                <RiDeleteBinLine />
            {/if}
            <span class="max-sm:hidden">Danger</span>
        </Tabs.Trigger>
    </Tabs.List>

    <Tabs.Content value="security" class="w-full flex flex-col gap-4">
        <H2>Security</H2>
        <SecurityTab />
    </Tabs.Content>
    <Tabs.Content value="sessions" class="w-full flex flex-col gap-4">
        <H2>Sessions</H2>
        <SessionsTab />
    </Tabs.Content>
    <Tabs.Content value="accounts" class="w-full flex flex-col gap-4">
        <H2>Linked Accounts</H2>
        <AccountsTab />
    </Tabs.Content>
    <Tabs.Content value="danger" class="w-full flex flex-col gap-4">
        <H2>Danger Zone</H2>
        <DangerTab />
    </Tabs.Content>    
  </Tabs.Root>
</main>