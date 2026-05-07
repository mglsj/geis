<script lang="ts">
import type { Session } from "better-auth";
import { UAParser } from "ua-parser-js";
import * as Card from "$lib/components/shadcn/card";
import { Badge } from "$lib/components/shadcn/badge";
import {
	RiAndroidLine,
	RiAppleLine,
	RiChromeLine,
	RiComputerLine,
	RiDeleteBinLine,
	RiDeviceLine,
	RiEdgeNewLine,
	RiFirefoxBrowserLine,
	RiIeLine,
	RiOperaLine,
	RiQqLine,
	RiSafariLine,
	RiSmartphoneLine,
	RiWindowsLine,
} from "remixicon-svelte";
import { H3, Muted } from "$lib/components/ui/typography";
import { Button } from "$lib/components/shadcn/button";
import { authClient } from "$lib/client/auth-client";

interface Props {
	sessions: Session[];
	currentSessionToken: string;
	getSessions: () => Promise<Session[]>;
}

let { sessions, currentSessionToken, getSessions }: Props = $props();

const currentSession = $derived(
	sessions.find((session) => session.token === currentSessionToken),
);
const otherSessions = $derived(
	sessions.filter((session) => session.token !== currentSessionToken),
);
</script>

{#snippet browserLogo(browser:string)}
    {@const lowerBrowser = browser.toLowerCase()}
    <span class="w-5 h-5">
        {#if lowerBrowser.includes("chrome")}
            <RiChromeLine />
        {:else if lowerBrowser.includes("firefox")}
            <RiFirefoxBrowserLine />
        {:else if lowerBrowser.includes("safari")}
        <RiSafariLine />
        {:else if lowerBrowser.includes("edge")}
            <RiEdgeNewLine/>
        {:else if lowerBrowser.includes("opera")}
            <RiOperaLine/>
        {:else}
            <RiIeLine/>
        {/if}
    </span>
{/snippet}

{#snippet osLogo(os:string)}
    {@const lowerOS = os.toLowerCase()}
    <span class="w-5 h-5">
        {#if lowerOS.includes("windows")}
            <RiWindowsLine />
        {:else if lowerOS.includes("mac")}
            <RiAppleLine />
        {:else if lowerOS.includes("linux")}
            <RiQqLine/>
        {:else if lowerOS.includes("android")}
             <RiAndroidLine/>
        {:else if lowerOS.includes("ios")}
             <RiAppleLine/>
        {:else}
            <RiDeviceLine/>
        {/if}
    </span>
{/snippet}

{#snippet sessionCard(session: Session, isCurrentSession: boolean)}
    {@const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null}
    <Card.Root class="w-full">
        <Card.Header>
            <Card.Title class="flex items-center gap-2">
                {@render browserLogo(userAgentInfo?.browser?.name || "")}
                {#if userAgentInfo}
                    {userAgentInfo.browser.name} on {@render osLogo(userAgentInfo.os.name || "")} {userAgentInfo.os.name}
                {:else}
                    Unknown Device
                {/if}
    
            </Card.Title>
            {#if isCurrentSession}
                <Card.Action>
                    <Badge>Current Session</Badge>
                </Card.Action>    
            {/if}
        </Card.Header>
        <Card.Content>
            <div class="flex items-center gap-4">
                <span class="w-8 h-8">
                    {#if userAgentInfo?.device.type === "mobile"}
                        <RiSmartphoneLine />
                    {:else}
                        <RiComputerLine />
                    {/if}
                </span>

                <div class="flex flex-col grow">
                    <Muted>Created: {new Date(session.createdAt).toLocaleString()}</Muted>
                    <Muted>Expires: {new Date(session.expiresAt).toLocaleString()}</Muted>
                    <Muted>IP Address: {session.ipAddress}</Muted>
                </div>

                {#if !isCurrentSession}
                    <Button variant="destructive"  size="icon" class="cursor-pointer" 
                        onclick={async () => await authClient.revokeSession({
                            token: session.token,
                            }, {
                            onSuccess: async () => {
                                sessions = await getSessions();
                            }
                            }
                            )}
                    >
                        <RiDeleteBinLine />
                    </Button>
                {/if}
                
            </div>
        </Card.Content>
    </Card.Root>
{/snippet}

{#if currentSession}
    {@render sessionCard(currentSession, true)}
{/if}

<H3>Other Active Sessions</H3>

{#each otherSessions as session}
    {@render sessionCard(session, false)}
{/each}

{#if otherSessions.length === 0}
    <Muted>No other active sessions found.</Muted>
{:else}
    <div class="flex justify-end">
        <Button variant="destructive" class="cursor-pointer"
            onclick={async () => await authClient.revokeOtherSessions({}, {
                onSuccess: async () => {
                    sessions = await getSessions();
                }
            })}
        >
            Revoke All Other Sessions
        </Button>
    </div>
{/if}

