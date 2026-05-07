import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

function isValidCallbackURL(url: string, origin: string): boolean {
	try {
		const parsedURL = new URL(url);
		return parsedURL.origin === origin;
	} catch {
		try {
			const parsedURL = new URL(url, origin);
			return url.startsWith("/") && parsedURL.origin === origin;
		} catch {}
	}

	return false;
}

export const load: LayoutServerLoad = async ({ url }) => {
	const callbackURL = url.searchParams.get("callback");

	if (callbackURL && !isValidCallbackURL(callbackURL, url.origin)) {
		url.searchParams.delete("callback");
		url.searchParams.set("error", "Invalid callback URL");
		throw redirect(303, url);
	}

	return {
		callback: new URL(callbackURL ?? "/", url.origin),
	};
};
