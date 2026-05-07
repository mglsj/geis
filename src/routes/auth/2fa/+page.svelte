<script lang="ts">
import { page } from "$app/state";
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { getAuthURL } from "$lib/helpers/urls.js";
import TotpForm from "./TotpForm.svelte";
import { RiKeyLine } from "remixicon-svelte";

let { data } = $props();

const callbackURL = data.callback.toString();
</script>

<Card.Root class=" w-sm max-w-sm">
  <Card.Header>
    <Card.Title>Two Factor Authentication</Card.Title>
    <Card.Description>Enter the code from your authenticator app.</Card.Description>
  </Card.Header>

  <Card.Content>
    <TotpForm {callbackURL} />
 </Card.Content>
</Card.Root>