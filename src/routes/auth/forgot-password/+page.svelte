<script lang="ts">
import { Button } from "$lib/components/shadcn/button/index.js";
import * as Card from "$lib/components/shadcn/card";
import ForgotPasswordForm from "./Form.svelte";

let { data } = $props();

const form = data.form;
const callbackURL = data.callback.toString();

let signInURL = $state("");
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
  
    <div>
        <Button 
          variant="link" 
            size="sm" 
            href={signInURL}
          >
          ← Back to Sign In
        </Button>
    </div>  

    <Card.Title>Forgot Password</Card.Title>
    <Card.Description>Enter your email to reset your password.</Card.Description>
  </Card.Header>

  <Card.Content>
    <ForgotPasswordForm {form} {callbackURL} bind:signInURL />
 </Card.Content>
</Card.Root>

