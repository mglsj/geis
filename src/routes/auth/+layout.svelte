<script lang="ts">
import { H3, Muted } from "$lib/components/ui/typography";

let { children } = $props();
</script>

<div class="min-h-screen flex items-center justify-center">
    <main class="flex flex-col gap-4 items-start justify-center">
        <H3 class="w-full text-center mb-4">
            <span class="block md:hidden">GEIS</span>
            <span class="hidden md:block">Graphic Era Identity Service</span>
        </H3>
        {@render children()}
        <Muted class="text-center w-full">
            &copy; {new Date().getFullYear()} GEUnified<br />All rights reserved
        </Muted>
    </main>
</div>

