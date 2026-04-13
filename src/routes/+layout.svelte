<script lang="ts">
import "./layout.css";
import { toast } from "svelte-sonner";
import { Toaster } from "$lib/components/shadcn/sonner";
import { onMount } from "svelte";
import { ModeWatcher } from "mode-watcher";

let { children, data } = $props();

onMount(() => {
	if (data.searchParams.get("toast")) {
		toast.info(data.searchParams.get("toast")!, {
			duration: 3000,
		});
		data.searchParams.delete("toast");
		window.history.replaceState(
			{},
			"",
			`${window.location.pathname}?${data.searchParams.toString()}`,
		);
	}
});
</script>


<ModeWatcher />
<Toaster />

<div class={"min-h-screen"}>
	{@render children()}
</div>

