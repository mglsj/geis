<script lang="ts">
import * as Card from "$lib/components/shadcn/card";
import ErpLoginForm from "./ErpLoginForm.svelte";
import type { ActionData } from "./$types.js";
import SignUpForm from "./SignUpForm.svelte";
import type { FormResult } from "sveltekit-superforms";
import { getAuthURL } from "$lib/helpers/urls.js";
import { page } from "$app/state";
import { Button } from "$lib/components/shadcn/button";

const { data } = $props();

let signupData: FormResult<ActionData> | null = $state(null);

function next(data: FormResult<ActionData>) {
	signupData = data;
}

function back() {
	signupData = null;
}

let username: string = $state("");

const signInURL = $derived.by(() => {
	const params = new URLSearchParams(page.url.searchParams);

	username && params.set("username", username);

	return getAuthURL("signin", {
		origin: page.url.origin,
		searchParams: params,
	}).toString();
});
</script>

<Card.Root class=" w-sm max-w-sm">
{#if !signupData}
  <Card.Header>
    <Card.Title>Welcome to GEIS</Card.Title>
    <Card.Description>
      Sign up with your ERP credentials to get started.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <ErpLoginForm form={data.loginForm} {next} bind:username />
  </Card.Content>
{:else}
  <Card.Header class="flex-col items-start">
    <div>
      <Button variant="link" size="sm" onclick={back} class="cursor-pointer">
        ← Back
      </Button>
    </div>
    <Card.Title>Sign Up</Card.Title>
    <Card.Description>Sign up for a new account.</Card.Description>
  </Card.Header>
  <Card.Content>
    <SignUpForm callback={data.callback.toString()} data={signupData} />
  </Card.Content>
{/if}
</Card.Root>

<Button variant="link" size="sm" 
  href={signInURL}
>
  Already have an account? Sign In
</Button>