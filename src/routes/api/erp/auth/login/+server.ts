import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
	const { token, captcha, username, password } = await request.json();
};
