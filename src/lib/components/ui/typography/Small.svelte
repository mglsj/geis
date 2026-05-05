<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
}

const { children }: Props = $props();
</script>

<small class="text-sm leading-none font-medium">
    {@render children()}
</small>