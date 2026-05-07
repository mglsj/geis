import { createAuthClient } from "better-auth/svelte"; // make sure to import from better-auth/svelte
import {
	adminClient,
	usernameClient,
	lastLoginMethodClient,
	twoFactorClient,
} from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { goto } from "$app/navigation";
import { getAuthURL } from "$lib/helpers/urls";

export const authClient = createAuthClient({
	plugins: [
		adminClient(),
		usernameClient(),
		twoFactorClient({
			onTwoFactorRedirect: (context) => {
				const redirect = getAuthURL("2fa", {
					origin: location.origin,
				});

				redirect.search = location.search;

				goto(redirect);
			},
		}),
		passkeyClient(),
		lastLoginMethodClient(),
		oauthProviderClient(),
	],
});
