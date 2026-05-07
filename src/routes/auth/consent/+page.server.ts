import { error, redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";
import { getAuthURL } from "$lib/helpers/urls";

export const load: PageServerLoad = async ({ locals, url, request }) => {
	if (!locals.user || !locals.session) {
		throw redirect(
			302,
			getAuthURL("signin", {
				origin: url.origin,
				searchParams: url.searchParams,
			}),
		);
	}

	const scope = url.searchParams.get("scope");
	const clientId = url.searchParams.get("client_id");

	if (!scope || !clientId) {
		return error(400, "Missing required query parameters: scope and client_id");
	}

	const client = await auth.api.getOAuthClientPublic({
		query: {
			client_id: clientId,
		},
		headers: request.headers,
	});

	return {
		client,
		scope,
	};
};
