import { createAuthClient } from "better-auth/svelte"; // make sure to import from better-auth/svelte
import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient } from "better-auth/client/plugins";
import { lastLoginMethodClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	plugins: [
		adminClient(),
		passkeyClient(),
		lastLoginMethodClient(),
		oauthProviderClient(),
	],
});
