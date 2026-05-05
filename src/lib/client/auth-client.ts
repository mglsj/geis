import { createAuthClient } from "better-auth/svelte"; // make sure to import from better-auth/svelte
import {
	adminClient,
	usernameClient,
	lastLoginMethodClient,
} from "better-auth/client/plugins";
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
	plugins: [
		adminClient(),
		usernameClient(),
		passkeyClient(),
		lastLoginMethodClient(),
		oauthProviderClient(),
	],
});
