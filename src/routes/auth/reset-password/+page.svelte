<script lang="ts">
import * as Card from "$lib/components/shadcn/card";
import ResetPasswordForm from "./Form.svelte";

let { data } = $props();

const form = data.form;
const callbackURL = data.callback.toString();
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Reset Password</Card.Title>
    <Card.Description>Enter your new password to reset password for {data.email ?? "your account"}.</Card.Description>
  </Card.Header>

  <Card.Content>
    <ResetPasswordForm {form} {callbackURL}/>
 </Card.Content>
</Card.Root>