<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import Header from "$lib/components/ui/Header.svelte";
import * as Avatar from "$lib/components/shadcn/avatar";
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

const session = authClient.useSession();

let tabValue: string = $state("profile");
</script>

<Header/>

<main class="p-4 mx-auto max-w-2xl gap-4 flex flex-col align-start items-start">
    <Button variant="link" href="/">
        <RiArrowLeftLine />
        Back to Home
    </Button>

    <h1 class="text-2xl font-bold">Profile</h1>

    <div class="flex flex-row gap-4">
        <div class="flex items-center">
            <Avatar.Root class="w-16 h-16">
                <Avatar.Image src={$session.data?.user.image} alt={$session.data?.user.name} />
                <Avatar.Fallback>{$session.data?.user.name.charAt(0)}</Avatar.Fallback>
            </Avatar.Root>
        </div>

        <div class="flex flex-col gap-1 justify-center items-start">
            <p class="text-lg font-medium">{$session.data?.user.name}</p>
            <p class="text-sm text-muted-foreground">{$session.data?.user.email}</p>
        </div>
    </div>

    <Tabs.Root bind:value={tabValue} class="w-full gap-4">
    
    <Tabs.List class="mx-auto">
        <Tabs.Trigger value="profile" >
            {#if tabValue === "profile"}
                <RiUserFill />
            {:else}
                <RiUserLine />
            {/if}
            <span class="max-sm:hidden">Profile</span>
        </Tabs.Trigger>
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

    <Tabs.Content value="profile" class="mx-auto">
        <Card.Root class="w-sm max-w-sm">
            <Card.Header>
                <Card.Title>Update Profile</Card.Title>
                <Card.Description>Update your profile information.</Card.Description>
            </Card.Header>
            <Card.Content>
                {#if $session.data?.user}
                    <ProfileUpdateForm user={$session.data?.user}/>
                {/if}
            </Card.Content>
        </Card.Root>
    </Tabs.Content>
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