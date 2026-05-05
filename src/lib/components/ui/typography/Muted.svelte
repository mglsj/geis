<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
	class?: string;
}

const { children, class: className }: Props = $props();
</script>

<p class={`text-muted-foreground text-sm ${className}`}>
    {@render children()}
</p>