import { error, type Cookies } from "@sveltejs/kit";
import { load } from "cheerio";
import makeFetchCookie from "fetch-cookie";
import { CookieJar } from "tough-cookie";
import { extractLoginError } from "./errors";
import { ERP_BASE_URL } from "./api";

export async function getLoginRequest({
	cookies,
	secure,
}: {
	cookies: Cookies;
	secure: boolean;
}): Promise<{ token: string; image: string }> {
	const jar = new CookieJar();
	const fetchWithCookies = makeFetchCookie(fetch, jar);

	try {
		// Get login page
		const initialResponse = await fetchWithCookies(new URL(ERP_BASE_URL));

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
			new URL("/Account/showcaptchaImage", ERP_BASE_URL),
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
		const cookieOptions = {
			httpOnly: true,
			sameSite: secure ? ("none" as const) : ("lax" as const),
			secure,
			path: "/",
		};

		(await jar.getCookies(ERP_BASE_URL)).forEach((cookie) => {
			cookies.set(cookie.key, cookie.value, cookieOptions);
		});

		return { token, image };
	} catch (err) {
		console.error(err);
		throw error(500, "Failed to fetch captcha image");
	}
}

export async function login({
	data,
	cookies,
	secure,
}: {
	data: {
		id: string;
		password: string;
		captcha: string;
		token: string;
	};
	cookies: Cookies;
	secure: boolean;
}): Promise<{ code: number; error: string } | undefined> {
	const jar = new CookieJar();
	const fetchWithCookies = makeFetchCookie(fetch, jar);

	try {
		const sessionID = cookies.get("ASP.NET_SessionId");
		const cookieToken = cookies.get("__RequestVerificationToken");

		if (!sessionID || !cookieToken) {
			return {
				code: 400,
				error: "Invalid cookies.",
			};
		}

		const formData = new URLSearchParams();
		formData.append("hdnMsg", "GEU");
		formData.append("checkOnline", "0");
		formData.append("__RequestVerificationToken", data.token);
		formData.append("UserName", data.id);
		formData.append("Password", data.password);
		formData.append("clientIP", "");
		formData.append("captcha", data.captcha);
		formData.append("HumanTypedFlag", "0");

		const response = await fetchWithCookies(new URL(ERP_BASE_URL), {
			method: "POST",
			redirect: "manual",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Referer: ERP_BASE_URL,
				Origin: ERP_BASE_URL,
				Cookie: `ASP.NET_SessionId=${sessionID}; __RequestVerificationToken=${cookieToken}`,
			},
			body: formData.toString(),
		});

		const redirectLocation =
			response.headers.get("location") || response.headers.get("Location");
		const setCookies = response.headers.get("set-cookie");

		const isSuccess =
			response.status === 302 &&
			setCookies &&
			setCookies.length > 0 &&
			redirectLocation &&
			redirectLocation !== "/" &&
			!redirectLocation.toLowerCase().includes("login");

		if (!isSuccess) {
			const body = await response.text();
			const error = extractLoginError(body) || "Invalid credentials or captcha";
			return {
				code: 401,
				error,
			};
		}

		const cookieOptions = {
			httpOnly: true,
			sameSite: secure ? ("none" as const) : ("lax" as const),
			secure,
			path: "/",
		};

		// Set cookies in the response
		(await jar.getCookies(ERP_BASE_URL)).forEach((cookie) => {
			cookies.set(cookie.key, cookie.value, cookieOptions);
		});
	} catch (err) {
		console.error(err);
		throw error(500, "Failed to login to ERP.");
	}
}
