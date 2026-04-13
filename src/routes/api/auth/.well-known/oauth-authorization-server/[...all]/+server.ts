import type { RequestHandler } from "./$types";
import { auth } from "$lib/server/auth";
import { oauthProviderAuthServerMetadata } from "@better-auth/oauth-provider";

const authServerMetadataHandler = oauthProviderAuthServerMetadata(auth);

export const GET: RequestHandler = ({ request }) =>
	authServerMetadataHandler(request);
