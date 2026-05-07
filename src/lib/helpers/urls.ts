type AuthPage =
	| "signin"
	| "signup"
	| "signout"
	| "verify"
	| "forgot-password"
	| "reset-password";

export function getAuthURL(
	page: AuthPage,
	{
		origin,
		searchParams,
	}: {
		origin: string;
		searchParams?: Record<string, string | null | undefined>;
	},
): URL {
	const url = new URL(`/auth/${page}`, origin);
	if (searchParams) {
		Object.entries(searchParams).forEach(([key, value]) => {
			if (value) url.searchParams.set(key, value);
		});
	}
	return url;
}
