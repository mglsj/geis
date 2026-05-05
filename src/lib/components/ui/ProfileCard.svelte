<script lang="ts">
import * as Avatar from "$lib/components/shadcn/avatar";
import { Large, Muted, Small } from "./typography";

interface Props {
	name: string;
	username: string;
	email: string;
	image?: string | null;
}

const { name, username, email, image }: Props = $props();
</script>

<div class="flex flex-row gap-4">
    <div class="flex items-center">
        <Avatar.Root class="w-18 h-18">
            <Avatar.Image src={image} alt={name} />
            <Avatar.Fallback>{name.charAt(0) || "U"}</Avatar.Fallback>
        </Avatar.Root>
    </div>

    <div class="flex flex-col gap-1 justify-center items-start text-ellipsis">
        <Large>{name}</Large>
        <Small>{email}</Small>
        <Muted>{username}</Muted>
    </div>
</div>