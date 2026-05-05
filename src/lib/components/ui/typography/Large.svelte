<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	class?: string;
	children: Snippet<[]>;
}

const { children, class: className }: Props = $props();
</script>

<div class={`text-lg font-semibold ${className}`}>
    {@render children()}
</div>