import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { load } from "cheerio";
import makeFetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";

export const GET: RequestHandler = async ({ cookies }) => {
	const jar = new CookieJar();
	const fetchWithCookies = makeFetchCookie(fetch, jar);

	try {
		const BASE_URL = "https://erp.gehu.ac.in";

		// Get login page
		const initialResponse = await fetchWithCookies(new URL(BASE_URL));

		if (!initialResponse.ok) {
			throw new Error(
				`Failed to fetch login page: ${initialResponse.statusText}`,
			);
		}

		// Get token
		const html = load(await initialResponse.text());
		const token = html('input[name="__RequestVerificationToken"]').attr(
			"value",
		);

		if (!token) {
			throw new Error("Failed to extract token from login page");
		}

		// Get captcha image
		const captchaResponse = await fetchWithCookies(
			new URL("/Account/showcaptchaImage", BASE_URL),
			{
				method: "POST",
				headers: {
					"X-Requested-With": "XMLHttpRequest",
					RequestVerificationToken: token,
				},
				body: "",
			},
		);

		if (!captchaResponse.ok) {
			throw new Error(
				`Failed to fetch captcha image: ${captchaResponse.statusText}`,
			);
		}

		// Decode captcha image
		const json = await captchaResponse.json();
		const base64Image = Buffer.from(json).toString("base64");
		const image = `data:image/png;base64,${base64Image}`;

		// Set cookies in the response
		(await jar.getCookies(BASE_URL)).forEach((cookie) => {
			cookies.set(cookie.key, cookie.value, {
				httpOnly: true,
				sameSite: "none",
				secure: true,
				path: "/",
			});
		});

		return Response.json({ token, image });
	} catch (err) {
		console.error(err);
		throw error(500, "Failed to fetch captcha image");
	}
};
