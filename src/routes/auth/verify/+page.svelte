<script lang="ts">
import { authClient } from "$lib/client/auth-client";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { onMount } from "svelte";
import { toast } from "svelte-sonner";

const { data } = $props();

const callbackURL = data.callback.toString();
const email = data.email;

let interval: NodeJS.Timeout;
let timeToNextResend = $state(30);

onMount(() => {
	startEmailVerificationCountdown();
});

function startEmailVerificationCountdown(time = 30) {
	timeToNextResend = time;

	interval = setInterval(() => {
		timeToNextResend -= 1;
		if (timeToNextResend <= 0) {
			clearInterval(interval);
		}
	}, 1000);
}

async function resendVerificationEmail() {
	startEmailVerificationCountdown();

	const { error } = await authClient.sendVerificationEmail({
		email: email,
		callbackURL: callbackURL,
	});

	if (error) {
		console.error("Error resending verification email:", error);
		toast.error(
			error.message ??
				"An error occurred while resending the verification email.",
			{
				duration: 3000,
			},
		);
	} else {
		toast.info("Verification email resent. Please check your inbox.", {
			duration: 3000,
		});
	}
}
</script>

<Card.Root class=" w-sm max-w-sm">
    <Card.Header>
        <Card.Title>Email Verification</Card.Title>
        <Card.Description>A verification email has been sent to <strong>{email}</strong>. 
</Card.Description>
    </Card.Header>

    <Card.Content class="space-y-4">
        <p class="text-sm text-muted-foreground">
           Please click the link in that email to verify your account. If you haven't received the email, please check your spam folder or try resending the verification email.
        </p>
    
        <Button variant="outline" class="w-full" disabled={timeToNextResend > 0} onclick={resendVerificationEmail}>
            Resend Verification Email {timeToNextResend > 0 ? `(${timeToNextResend}s)` : ""}
        </Button>
    </Card.Content>

</Card.Root>
