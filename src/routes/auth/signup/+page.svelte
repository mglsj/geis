<script lang="ts">
import * as Card from "$lib/components/shadcn/card";
import SignUpForm from "./form.svelte";

const { data } = $props();

const form = data.form;
const callbackURL = data.callback.toString();
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Sign Up</Card.Title>
    <Card.Description>Create an account to get started.</Card.Description>
  </Card.Header>

  <Card.Content>
    <SignUpForm {form} {callbackURL} />
 </Card.Content>
</Card.Root>