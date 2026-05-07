<script lang="ts">
import { Button } from "$lib/components/shadcn/button";
import * as Card from "$lib/components/shadcn/card";
import { RiArrowLeftLine } from "remixicon-svelte";
import Form from "./Form.svelte";

let { data } = $props();
</script>

<Button href="/developer" variant="link">
    <RiArrowLeftLine />Back to Clients
</Button>

<Card.Root class="w-full">
  <Card.Header>
    <Card.Title>Register New OAuth Client</Card.Title>
    <Card.Description>Create a new OAuth client for your application.</Card.Description>
  </Card.Header>

  <Card.Content>
    <Form/>
 </Card.Content>
</Card.Root>

