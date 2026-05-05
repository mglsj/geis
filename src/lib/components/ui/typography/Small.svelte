<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	class?: string;
	children: Snippet<[]>;
}

const { children, class: className }: Props = $props();
</script>

<small class={`text-sm leading-none font-medium ${className}`}>
    {@render children()}
</small>