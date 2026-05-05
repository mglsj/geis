<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
}

const { children }: Props = $props();
</script>

<p class="text-muted-foreground text-xl">
    {@render children()}
</p>