<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
}

const { children }: Props = $props();
</script>

<h4 class="scroll-m-20 text-xl font-semibold tracking-tight">
    {@render children()}
</h4>