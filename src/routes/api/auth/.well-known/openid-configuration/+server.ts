import type { RequestHandler } from "./$types";
import { auth } from "$lib/server/auth";
import { oauthProviderOpenIdConfigMetadata } from "@better-auth/oauth-provider";

const openIdConfigHandler = oauthProviderOpenIdConfigMetadata(auth);

export const GET: RequestHandler = ({ request }) =>
	openIdConfigHandler(request);
