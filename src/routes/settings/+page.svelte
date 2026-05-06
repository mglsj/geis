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
	RiUserFill,
	RiUserLine,
} from "remixicon-svelte";
import * as Tabs from "$lib/components/shadcn/tabs";
import * as Card from "$lib/components/shadcn/card";
import ProfileUpdateForm from "./ProfileUpdateForm.svelte";
import ProfileCard from "$lib/components/ui/ProfileCard.svelte";
import { H1 } from "$lib/components/ui/typography";

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

    <Tabs.Content value="security">
        <p>Security content goes here.</p>
    </Tabs.Content>
    <Tabs.Content value="sessions">
        <p>Sessions content goes here.</p>
    </Tabs.Content>
    <Tabs.Content value="accounts">
        <p>Accounts content goes here.</p>
    </Tabs.Content>
    <Tabs.Content value="danger">
        <p>Danger content goes here.</p>
    </Tabs.Content>    
  </Tabs.Root>

</main>