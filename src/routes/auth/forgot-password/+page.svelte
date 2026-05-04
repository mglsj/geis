<script lang="ts">
import * as Card from "$lib/components/shadcn/card";
import ForgotPasswordForm from "./Form.svelte";

let { data } = $props();

const form = data.form;
const callbackURL = data.callback.toString();
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Forgot Password</Card.Title>
    <Card.Description>Enter your email to reset your password.</Card.Description>
  </Card.Header>

  <Card.Content>
    <ForgotPasswordForm {form} {callbackURL}/>
 </Card.Content>
</Card.Root>