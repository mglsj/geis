<script lang="ts">
import { page } from "$app/state";
import { authClient } from "$lib/client/auth-client";
import { Button } from "$lib/components/shadcn/button";
import { getAuthURL } from "$lib/helpers/urls";
import * as DropdownMenu from "$lib/components/shadcn/dropdown-menu";
import { goto } from "$app/navigation";
import * as AlertDialog from "$lib/components/shadcn/alert-dialog";
import { buttonVariants } from "$lib/components/shadcn/button";
import { RiSettingsLine } from "remixicon-svelte";
import { Large } from "./typography";

const session = authClient.useSession();

let showLogoutDialog = $state(false);
</script>

<header class="p-4 border-b">
    <nav class="flex flex-row items-center justify-between">
        <div class="flex w-0 grow flex-row items-center gap-4">
            <a href="/">
                <Large>
                    <span class="block md:hidden">GEIS</span>
                    <span class="hidden md:block">Graphic Era Identity Service</span>
                </Large>
            </a>
        </div>
        
        <div class="flex w-0 flex-1 flex-row items-center justify-end gap-4">
            {#if $session.data}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        {#snippet child({ props })}
                        <Button {...props} variant="outline" size="icon">
                            <RiSettingsLine  />
                        </Button>
                        {/snippet}
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content class="w-56" align="end">
                        <DropdownMenu.Label>My Account</DropdownMenu.Label>
                        
                        <DropdownMenu.Item onclick={() => goto("/settings")}>
                            Settings
                        </DropdownMenu.Item>

                        <DropdownMenu.Item onclick={() => goto("/developer")}>
                            Developer
                        </DropdownMenu.Item>

                        <DropdownMenu.Separator />

                        <DropdownMenu.Item  onSelect={() => (showLogoutDialog = true)}
                            class="text-destructive hover:bg-destructive/50 focus:bg-destructive/50 data-[state=open]:bg-destructive/50 hover:text-white focus:text-white data-[state=open]:text-white"
                        >
                            Log out
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            {:else}
                <Button href={getAuthURL("signin", {origin: page.url.origin}).toString()}>Login</Button>
            {/if}
        </div>
    </nav>
</header>

<AlertDialog.Root bind:open={showLogoutDialog}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you sure?</AlertDialog.Title>
      <AlertDialog.Description>
        Do you really want to log out? You will need to log in again to access your account and data.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel class={buttonVariants({ variant: "outline" })}>
        Cancel
      </AlertDialog.Cancel>
      <AlertDialog.Action 
        class={buttonVariants({ variant: "destructive" })} 
        onclick={() => goto(getAuthURL("signout", {origin: page.url.origin}))}
    >
        Log Out
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>