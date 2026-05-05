<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
}

const { children }: Props = $props();
</script>

<h3 class="scroll-m-20 text-2xl font-semibold tracking-tight">
    {@render children()}
</h3>