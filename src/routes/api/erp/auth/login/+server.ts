import type { RequestHandler } from "./$types";

const login = async ({ token, captcha, username, password,  }) => {};

export const POST: RequestHandler = async ({ cookies, request }) => {
	const { token, captcha, username, password } = await request.json();
};
