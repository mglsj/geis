<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import {
	RiLockPasswordLine,
	RiEyeOffLine,
	RiEyeLine,
	RiUserLine,
} from "remixicon-svelte";
import SuperDebug, { superForm, defaults } from "sveltekit-superforms";
import { zod4, zod4Client } from "sveltekit-superforms/adapters";
import { Button } from "$lib/components/shadcn/button";
import { authClient } from "$lib/client/auth-client";
import { toast } from "svelte-sonner";
import { Spinner } from "$lib/components/shadcn/spinner";
import { z } from "zod";
import {
	TagsInput,
	type TagsInputProps,
} from "$lib/components/shadcn/tags-input";
import type { OAuthClient } from "@better-auth/oauth-provider";
import * as RadioGroup from "$lib/components/shadcn/radio-group";

// Client Schema according to RFC7591
// https://datatracker.ietf.org/doc/html/rfc7591
const createClientSchema = z.object({
	redirect_uris: z
		.array(z.url())
		.min(1, "At least one redirect URI is required"),
	scope: z.array(z.string()).optional().default([]),
	client_name: z.string().min(1, "Client name is required"),
	client_uri: z.url().optional(),
	logo_uri: z.url().optional(),
	contacts: z.array(z.email()).optional(),
	tos_uri: z.url().optional(),
	policy_uri: z.url().optional(),
	software_id: z.string().optional(),
	software_version: z.string().optional(),
	software_statement: z.string().optional(),
	post_logout_redirect_uris: z.array(z.url()).optional(),
	token_endpoint_auth_method: z
		.enum(["none", "client_secret_basic", "client_secret_post"])
		.optional()
		.default(null),
	grant_types: z
		.array(
			z.enum(["authorization_code", "client_credentials", "refresh_token"]),
		)
		.optional(),
	response_types: z.array(z.enum(["code"])).optional(),
	type: z.enum(["web", "native", "user-agent-based"]).optional(),
});

// createClient: <ClientFetchOption<Partial<{
//     redirect_uris: string[];
//     scope?: string | undefined;
//     client_name?: string | undefined;
//     client_uri?: string | undefined;
//     logo_uri?: string | undefined;
//     contacts?: string[] | undefined;
//     tos_uri?: string | undefined;
//     policy_uri?: string | undefined;
//     software_id?: string | undefined;
//     software_version?: string | undefined;
//     software_statement?: string | undefined;
//     post_logout_redirect_uris?: string[] | undefined;
//     token_endpoint_auth_method?: "none" | "client_secret_basic" | "client_secret_post" | undefined;
//     grant_types?: ("authorization_code" | "client_credentials" | "refresh_token")[] | undefined;
//     response_types?: "code"[] | undefined;
//     type?: "web" | ... 2 more ... | undefined;
// }> & Record<...>, Partial<...> & Record<...>, Record<...> | undefined>>(data_0: Prettify<...>, data_1?: ClientFetchOption<...> | undefined) => Promise<...>

let client: OAuthClient | null = $state(null);

const form = superForm(defaults(zod4(createClientSchema)), {
	validators: zod4Client(createClientSchema),
	clearOnSubmit: "none",
	dataType: "json",
	SPA: true,
	onUpdate: async ({ form }) => {
		if (!form.valid) return;

		const { data, error } = await authClient.oauth2.createClient({
			redirect_uris: form.data.redirect_uris,
			scope: form.data.scope?.join(" "),
			client_name: form.data.client_name,
			client_uri: form.data.client_uri,
			logo_uri: form.data.logo_uri,
			contacts: form.data.contacts,
			tos_uri: form.data.tos_uri,
			policy_uri: form.data.policy_uri,
			software_id: form.data.software_id,
			software_version: form.data.software_version,
			software_statement: form.data.software_statement,
			post_logout_redirect_uris: form.data.post_logout_redirect_uris,
			token_endpoint_auth_method: form.data.token_endpoint_auth_method,
			grant_types: form.data.grant_types,
			response_types: form.data.response_types,
			type: form.data.type,
		});

		if (error) {
			toast.error(`Error creating client: ${error.message}`);
			form.valid = false;
			return;
		}

		client = data;
	},
});

const { form: formData, enhance, constraints, submitting } = form;

const redirectUriValidate: TagsInputProps["validate"] = (val, tags) => {
	try {
		const transformed = z.url().parse(val.trim());

		// disallow empties
		if (transformed.length === 0) return undefined;

		// disallow duplicates
		if (tags.find((t) => transformed === t)) return undefined;

		return transformed;
	} catch (e) {
		return undefined;
	}
};

const scopeValidate: TagsInputProps["validate"] = (val, tags) => {
	const transformed = val.trim().toLowerCase();

	if (transformed.length === 0) return undefined;

	if (tags.find((t) => transformed === t)) return undefined;

	return transformed;
};
</script>

{#if client}
    <p><strong>Client ID:</strong> {client.client_id}</p>
    <p><strong>Client Secret:</strong> {client.client_secret}</p>
    <hr />
    <p><strong>Client Name:</strong> {client.client_name}</p>
    <p><strong>Redirect URIs:</strong></p>
    <ul class="list-disc list-inside">
        {#each client.redirect_uris as uri}
            <li>{uri}</li>
        {/each}
    </ul>
    {#if client.scope}
        <p><strong>Scopes:</strong> {client.scope}</p>
    {/if}
    {#if client.client_uri}
        <p><strong>Client URI:</strong> <a href="{client.client_uri}" target="_blank">{client.client_uri}</a></p>
    {/if}
    {#if client.logo_uri}
        <p><strong>Logo URI:</strong> <a href="{client.logo_uri}" target="_blank">{client.logo_uri}</a></p>
    {/if}
    {#if client.contacts?.length}
        <p><strong>Contacts:</strong></p>
        <ul class="list-disc list-inside">
            {#each client.contacts as contact}
                <li>{contact}</li>
            {/each}
        </ul>
    {/if}
    {#if client.tos_uri}
        <p><strong>TOS URI:</strong> <a href="{client.tos_uri}" target="_blank">{client.tos_uri}</a></p>
    {/if}
    {#if client.policy_uri}
        <p><strong>Policy URI:</strong> <a href="{client.policy_uri}" target="_blank">{client.policy_uri}</a></p>
    {/if}
    {#if client.software_id}
        <p><strong>Software ID:</strong> {client.software_id}</p>
    {/if}
    {#if client.software_version}
        <p><strong>Software Version:</strong> {client.software_version}</p>
    {/if}
    {#if client.software_statement}
        <p><strong>Software Statement:</strong> {client.software_statement}</p>
    {/if}
    {#if client.post_logout_redirect_uris?.length}
        <p><strong>Post Logout Redirect URIs:</strong></p>
        <ul class="list-disc list-inside">
            {#each client.post_logout_redirect_uris as uri}
                <li>{uri}</li>
            {/each}
        </ul>
    {/if}
    {#if client.token_endpoint_auth_method}
        <p><strong>Token Endpoint Auth Method:</strong> {client.token_endpoint_auth_method}</p>
    {/if}
    {#if client.grant_types?.length}
        <p><strong>Grant Types:</strong> {client.grant_types.join(", ")}</p>
    {/if}
    {#if client.response_types?.length}
        <p><strong>Response Types:</strong> {client.response_types.join(", ")}</p>
    {/if}
    {#if client.type}
        <p><strong>Client Type:</strong> {client.type}</p>
    {/if}
{:else}
    <form method="POST" use:enhance class="space-y-6">
    <Form.Field {form} name="client_name">
        <Form.Control>
        {#snippet children({ props })}
            <Form.Label>*Client Name</Form.Label>
            <InputGroup.Root>
            <InputGroup.Addon align="inline-start">
                    <RiUserLine />
            </InputGroup.Addon>
            <InputGroup.Input 
                {...props}
                type="text"
                bind:value={$formData.client_name} 
                {...$constraints.client_name} 
            />
            </InputGroup.Root>
        {/snippet}
        </Form.Control>
        <Form.Description>Name of the client application.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>

    <Form.Field {form} name="client_uri">
        <Form.Control>
        {#snippet children({ props })}
            <Form.Label>Client URI</Form.Label>
            <InputGroup.Root>
            <InputGroup.Addon align="inline-start">
                    <RiUserLine />
            </InputGroup.Addon>
            <InputGroup.Input 
                {...props}
                type="text"
                bind:value={$formData.client_uri} 
                {...$constraints.client_uri} 
            />
            </InputGroup.Root>
        {/snippet}
        </Form.Control>
        <Form.Description>(Optional) URI of the client application.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>

        <Form.Field {form} name="redirect_uris">
            <Form.Control>
            {#snippet children({ props })}
                <Form.Label>*Redirect URIs</Form.Label>
                <TagsInput
                    {...props}
                    bind:value={$formData.redirect_uris}
                    validate={redirectUriValidate}
                    placeholder="Enter redirect URIs and press Enter"
                />
            {/snippet}
            </Form.Control>
            <Form.Description>Comma-separated list of redirect URIs.</Form.Description>
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="scope">
            <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Scopes</Form.Label>
                <TagsInput
                    {...props}
                    bind:value={$formData.scope}
                    validate={scopeValidate}
                    placeholder="Enter scope and press Enter"
                />
            {/snippet}
            </Form.Control>
            <Form.Description>(Optional) List of scopes the client can request.</Form.Description>
            <Form.FieldErrors />
        </Form.Field>

        <Form.Field {form} name="token_endpoint_auth_method">
            <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Token Endpoint Auth Method</Form.Label>
                <RadioGroup.Root bind:value={$formData.token_endpoint_auth_method} {...props}>
                    <div class="flex items-center space-x-2">
                        <RadioGroup.Item value="none" id="r1" />
                        <Form.Label for="r1">None</Form.Label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <RadioGroup.Item value="client_secret_post" id="r2" />
                        <Form.Label for="r2">Client Secret Post</Form.Label>
                    </div>
                    <div class="flex items-center space-x-2">
                        <RadioGroup.Item value="client_secret_basic" id="r3" />
                        <Form.Label for="r3">Client Secret Basic</Form.Label>
                    </div>
                </RadioGroup.Root>
            {/snippet}
            </Form.Control>
            <Form.Description>(Optional) Authentication method for token endpoint.</Form.Description>
            <Form.FieldErrors />
        </Form.Field>


    {#if $submitting}
        <Form.Button class="w-full" type="submit" disabled>
            <Spinner/> Creating...
        </Form.Button>
    {:else}
        <Form.Button class="w-full cursor-pointer" type="submit">Create Client</Form.Button>
    {/if}

    </form >
{/if}