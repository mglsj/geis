<script>
import { page } from "$app/state";
import { authClient } from "$lib/client/auth-client";
import { Button } from "$lib/components/shadcn/button";
import { getAuthURL } from "$lib/helpers/urls";
import { toast } from "svelte-sonner";

const session = authClient.useSession();

async function setPassword() {
	const { error } = await authClient.requestPasswordReset({
		email: $session.data?.user.email || "",
		redirectTo: getAuthURL("reset-password", {
			origin: page.url.origin,
			searchParams: {
				callback: page.url.pathname,
				email: $session.data?.user.email || "",
			},
		}).toString(),
	});

	if (error) {
		toast.error(
			error.message ?? "An error occurred while resetting password.",
			{
				duration: 3000,
			},
		);
		console.log("Error resetting password:", error);
	} else {
		toast.success("Password reset email sent. Please check your inbox.", {
			duration: 3000,
		});
	}
}
</script>

<Button onclick={setPassword} class="w-full cursor-pointer">
    Send Reset Link
</Button>