<script lang="ts">
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";

import Form from "./Form.svelte";

const { data } = $props();

const callbackURL = data.callback.toString();
let email = $state(data.email ?? "");
</script>

<Card.Root class=" w-sm max-w-sm">
    <Card.Header>
        <Card.Title>Email Verification</Card.Title>
        <Card.Description>A verification email has been sent{#if email}
				to <strong>{email}</strong>
			{/if}.
</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4">
        <p class="text-sm text-muted-foreground">
           Please click the link in that email to verify your account. If you haven't received the email, please check your spam folder or try resending the verification email.
        </p>
		
		<Button variant="link" class="w-full" href="https://outlook.cloud.microsoft/mail/" target="_blank">
			Open Outlook ☍
		</Button>

        <Form bind:email={email} {callbackURL} />
    </Card.Content>

</Card.Root>
