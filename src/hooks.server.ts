import type { Handle } from "@sveltejs/kit";
import { building } from "$app/environment";
import { auth } from "$lib/server/auth";
import { svelteKitHandler } from "better-auth/svelte-kit";
import {
	oauthProviderAuthServerMetadata,
	oauthProviderOpenIdConfigMetadata,
} from "@better-auth/oauth-provider";

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	if (event.url.pathname === "/api/auth/.well-known/openid-configuration") {
		return oauthProviderOpenIdConfigMetadata(auth)(event.request);
	}

	if (
		event.url.pathname === "/.well-known/oauth-authorization-server/api/auth"
	) {
		return oauthProviderAuthServerMetadata(auth)(event.request);
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
