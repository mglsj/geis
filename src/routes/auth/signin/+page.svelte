<script lang="ts">
import { page } from "$app/state";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { getAuthURL } from "$lib/helpers/urls.js";
import SignInForm from "./Form.svelte";
import { RiKeyLine } from "remixicon-svelte";

let { data } = $props();

const form = data.form;
const callbackURL = data.callback.toString();

const signUpURL = $derived(
	getAuthURL("signup", {
		origin: page.url.origin,
		searchParams: {
			callback: callbackURL,
		},
	}).toString(),
);
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Sign In</Card.Title>
    <Card.Description>Sign in to your account.</Card.Description>
  </Card.Header>

  <Card.Content>
    <SignInForm {form} {callbackURL}/>
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