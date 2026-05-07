import { RiGithubFill, RiGithubLine } from "remixicon-svelte";
import type { Component } from "svelte";
import type { SVGAttributes } from "svelte/elements";

export const SUPPORTED_OAUTH_PROVIDERS = ["github"] as const;

export type SupportedOAuthProvider = (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDER_DETAILS: Record<
	SupportedOAuthProvider,
	{ name: string; Icon: Component<SVGAttributes<SVGSVGElement>, {}, ""> }
> = {
	github: {
		name: "GitHub",
		Icon: RiGithubLine,
	},
};
