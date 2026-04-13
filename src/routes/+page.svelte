<script lang="ts">
import { onMount } from "svelte";
import { authClient } from "$lib/client/auth-client";

const session = authClient.useSession();
</script>


<h1>
    Hi {$session.data?.user?.name || "Guest"}!
</h1>