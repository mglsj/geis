<script lang="ts">
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { RiDeleteBinFill } from "remixicon-svelte";
</script>

<Card.Root class="border border-destructive">
    <Card.Header>
        <Card.Title class="text-destructive">Danger Zone</Card.Title>
        <Card.Description class="text-destructive">
            This action is irreversible. Please proceed with caution.
        </Card.Description>
    </Card.Header>
    <Card.Content>
        <Button variant="destructive" class="cursor-pointer">
            <RiDeleteBinFill />
            Delete Account Permanently
        </Button>
    </Card.Content>
</Card.Root>
