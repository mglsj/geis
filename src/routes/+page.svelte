<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import Header from "$lib/components/ui/Header.svelte";

const session = authClient.useSession();
</script>

<Header/>

<main class="p-4">
    <h1>
        Hi {$session.data?.user?.name || "Guest"}!
    </h1>
</main>