<script lang="ts">
import * as Card from "$lib/components/shadcn/card";
import ErpLoginForm from "./ErpLoginForm.svelte";
import * as Tabs from "$lib/components/shadcn/tabs";
import type { ActionData } from "./$types.js";
import SignUpForm from "./SignUpForm.svelte";
import type { FormResult } from "sveltekit-superforms";
import { getAuthURL } from "$lib/helpers/urls.js";
import { page } from "$app/state";
import { Button } from "$lib/components/shadcn/button";

const { data } = $props();

// const callback = data.callback.toString();

let tab: "erp" | "signup" = $state("erp");
let signupData: FormResult<ActionData> = $state({});

function next(data: FormResult<ActionData>) {
	tab = "signup";
	signupData = data;
}

function back() {
	tab = "erp";
	signupData = {};
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
  <Card.Header>
    <Tabs.Root bind:value={tab} class="w-full">
      <Tabs.Content value="erp">
        <Card.Title>Welcome to GEIS</Card.Title>
        <Card.Description>
          Sign up with your ERP credentials to get started.
        </Card.Description>
      </Tabs.Content>
      <Tabs.Content value="signup">
        <Button variant="link" size="sm" onclick={back} class="cursor-pointer">
          ← Back
        </Button>
        <Card.Title>Sign Up</Card.Title>
        <Card.Description>Sign up for a new account.</Card.Description>
      </Tabs.Content>
    </Tabs.Root>
  </Card.Header>
  <Card.Content>
    <Tabs.Root bind:value={tab} class="w-full">
      <Tabs.Content value="erp">
        <ErpLoginForm form={data.loginForm} {next} bind:username />
      </Tabs.Content>
      <Tabs.Content value="signup">
        <SignUpForm form={data.signupForm} bind:data={signupData} />
      </Tabs.Content>
    </Tabs.Root>
 </Card.Content>
</Card.Root>

<Button variant="link" size="sm" 
  href={signInURL}
>
  Already have an account? Sign In
</Button>