<script lang="ts">
import { page } from "$app/state";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { getAuthURL } from "$lib/helpers/urls.js";
import SignInForm from "./SignInForm.svelte";
import { RiKeyLine } from "remixicon-svelte";

let { data } = $props();

const form = data.form;
const callback = data.callback.toString();

let username: string = $state("");

const signUpURL = $derived.by(() => {
	const params = new URLSearchParams(page.url.searchParams);

	username && params.set("username", username);

	return getAuthURL("signup", {
		origin: page.url.origin,
		searchParams: params,
	}).toString();
});
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Sign In</Card.Title>
    <Card.Description>Sign in to your account.</Card.Description>
  </Card.Header>

  <Card.Content>
    <SignInForm {form} {callback} bind:username/>
 </Card.Content>

 <Card.Footer>
  <Button variant="outline" size="sm" class="w-full">
    <RiKeyLine/> Sign in with Passkey
  </Button>
 </Card.Footer>
</Card.Root>

<Button variant="link" size="sm" 
  href={signUpURL}>
      Don't have an account? Sign Up
</Button>