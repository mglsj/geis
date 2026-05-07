import { auth } from "$lib/server/auth";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ request }) => {
	const client = await auth.api.createOAuthClient({
		headers: request.headers,
		body: {
			client_name: "Test App",
			redirect_uris: [
				"http://localhost:4321/callback",
				"http://localhost:4321/auth/callback",
			],
		},
	});

	return Response.json(client);
};
