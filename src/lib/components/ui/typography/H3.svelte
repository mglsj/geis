<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	class?: string;
	children: Snippet<[]>;
}

const { children, class: className }: Props = $props();
</script>

<h3 class={`scroll-m-20 text-2xl font-semibold tracking-tight ${className}`}>
    {@render children()}
</h3>