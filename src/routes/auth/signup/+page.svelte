<script lang="ts">
import * as Card from "$lib/components/shadcn/card";
import ErpLoginForm from "./ErpLoginForm.svelte";
import * as Tabs from "$lib/components/shadcn/tabs";
import type { ActionData } from "./$types.js";
import SignUpForm from "./SignUpForm.svelte";
import type { FormResult } from "sveltekit-superforms";

const { data } = $props();

const callbackURL = data.callback.toString();

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
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Sign Up</Card.Title>
    <Card.Description>Create an account to get started.</Card.Description>
  </Card.Header>
  <Card.Content>
    <Tabs.Root bind:value={tab} class="w-full">
      <Tabs.Content value="erp">
        <ErpLoginForm form={data.loginForm} {callbackURL} {next} />
      </Tabs.Content>
      <Tabs.Content value="signup">
        <SignUpForm form={data.signupForm} {callbackURL} bind:data={signupData} {back} />
      </Tabs.Content>
    </Tabs.Root>
 </Card.Content>
</Card.Root>