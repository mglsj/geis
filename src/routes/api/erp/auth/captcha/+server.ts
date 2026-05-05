import type { RequestHandler } from "./$types";
import { getLoginRequest } from "$lib/server/erp/auth";

export const GET: RequestHandler = async ({ cookies, url }) => {
	const secure = url.protocol === "https:";

	return Response.json(await getLoginRequest({ cookies, secure }));
};
