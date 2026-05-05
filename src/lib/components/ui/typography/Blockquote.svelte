<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
}

const { children }: Props = $props();
</script>

<blockquote class="mt-6 border-s-2 ps-6 italic">
    {@render children()}
</blockquote>