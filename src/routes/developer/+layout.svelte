<script lang="ts">
import Header from "$lib/components/ui/Header.svelte";

const { children } = $props();
</script>

<Header/>

<main class="p-4 pt-10 max-w-full gap-4 flex flex-col align-start items-start">
    {@render children()}
</main>
