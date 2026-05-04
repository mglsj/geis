<script lang="ts">
import "./layout.css";
import { toast } from "svelte-sonner";
import { Toaster } from "$lib/components/shadcn/sonner";
import { onMount } from "svelte";
import { ModeWatcher } from "mode-watcher";
import { page } from "$app/state";

let { children } = $props();

onMount(() => {
	if (page.url.searchParams.get("toast")) {
		toast(page.url.searchParams.get("toast")!, {
			duration: 3000,
		});
		page.url.searchParams.delete("toast");
		window.history.replaceState({}, "", page.url);
	}

	if (page.url.searchParams.get("error")) {
		toast.error(page.url.searchParams.get("error")!, {
			duration: 3000,
		});
		page.url.searchParams.delete("error");
		window.history.replaceState({}, "", page.url);
	}
});
</script>


<ModeWatcher />
<Toaster />

<div class="min-h-screen">
	{@render children()}
</div>

