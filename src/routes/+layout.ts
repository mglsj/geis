import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
	const searchParams = new URLSearchParams(url.search);

	return {
		searchParams,
	};
};
