<script lang="ts">
import type { Snippet } from "svelte";

interface Props {
	children: Snippet<[]>;
}

const { children }: Props = $props();
</script>

<ul class="my-6 ms-6 list-disc [&>li]:mt-2">
    {@render children()}
</ul>