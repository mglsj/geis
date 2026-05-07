type AuthPage =
	| "signin"
	| "signup"
	| "signout"
	| "verify"
	| "2fa"
	| "forgot-password"
	| "reset-password";

export function getAuthURL(
	page: AuthPage,
	{
		origin,
		searchParams,
	}: {
		origin: string;
		searchParams?:
			| Record<string, string | null | undefined>
			| URLSearchParams
			| string;
	},
): URL {
	const url = new URL(`/auth/${page}`, origin);
	if (searchParams) {
		if (typeof searchParams === "string") {
			url.search = searchParams;
		} else if (searchParams instanceof URLSearchParams) {
			url.search = searchParams.toString();
		} else {
			Object.entries(searchParams).forEach(([key, value]) => {
				if (value) url.searchParams.set(key, value);
			});
		}
	}
	return url;
}
