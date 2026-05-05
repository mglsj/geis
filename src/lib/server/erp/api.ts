import type { Cookies } from "@sveltejs/kit";

export const ERP_BASE_URL = "https://student.gehu.ac.in";

export const fetchGEU = async (
	endpoint: string,
	cookies: Cookies,
	options: RequestInit = {},
) => {
	const sessionId = cookies.get("ASP.NET_SessionId");
	const token = cookies.get("__RequestVerificationToken");

	if (!sessionId || !token) {
		throw new Error("Missing required cookies for authentication");
	}

	const {
		method = "GET",
		headers = {},
		referrer = ERP_BASE_URL,
		body,
	} = options;

	const url = new URL(endpoint, ERP_BASE_URL);

	try {
		const response = await fetch(url, {
			method,
			headers: {
				"X-Requested-With": "XMLHttpRequest",
				"Content-Type": "application/json",
				Origin: ERP_BASE_URL,
				Referer: referrer,
				Cookie: `ASP.NET_SessionId=${sessionId}; __RequestVerificationToken=${token}`,
				...headers,
			},
			body: body,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Request failed with status ${response.status}: ${errorText}`,
			);
		}

		if ((await response.clone().text()).includes("<title>Graphic Era")) {
			throw new Error("Session expired. Please log in again.");
		}

		return response;
	} catch (error) {
		console.error(`Error fetching from ${endpoint}:`, error);
		throw error;
	}
};
