<script lang="ts">
import { page } from "$app/state";
import { authClient } from "$lib/client/auth-client";
import { Button } from "$lib/components/shadcn/button";
import { getAuthURL } from "$lib/helpers/urls";

const session = authClient.useSession();
</script>

<header class="p-4 border-b bg-muted">
    <nav class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center gap-4">
            <a href="/">GEIS</a>
        </div>

        <div class="flex flex-row grow  items-center justify-center gap-4">
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </div>

        <div class="flex flex-row items-center gap-4">
            {#if $session.data}
            <a href="/profile">Profile</a>
            <Button variant="outline" href={getAuthURL("signout", {origin: page.url.origin}).toString()}>Sign Out</Button>
            {:else}
                <Button href={getAuthURL("signin", {origin: page.url.origin}).toString()}>Login</Button>
                <Button variant="outline" href={getAuthURL("signup", {origin: page.url.origin}).toString()}>Register</Button>
            {/if}
        </div>
    </nav>
</header>