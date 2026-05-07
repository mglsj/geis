<script lang="ts">
import * as Form from "$lib/components/shadcn/form";
import * as InputGroup from "$lib/components/shadcn/input-group";
import {
	RiUserLine,
	RiLockPasswordLine,
	RiEyeOffLine,
	RiEyeLine,
	RiDeleteBinLine,
} from "remixicon-svelte";
import { erpLoginFormSchema, type ErpLoginFormSchema } from "./schema";
import {
	type SuperValidated,
	type Infer,
	superForm,
	type FormResult,
} from "sveltekit-superforms";
import { zod4Client } from "sveltekit-superforms/adapters";
import { Button } from "$lib/components/shadcn/button";
import { onMount } from "svelte";
import { toast } from "svelte-sonner";
import * as InputOTP from "$lib/components/shadcn/input-otp";
import Skeleton from "$lib/components/shadcn/skeleton/skeleton.svelte";
import { solveCaptcha } from "$lib/client/captcha";
import type { ActionData } from "./$types";
import { Spinner } from "$lib/components/shadcn/spinner";

interface Props {
	form: SuperValidated<Infer<ErpLoginFormSchema>>;
	next: (data: FormResult<ActionData>) => void;
	username: string;
}

let { form: defaultForm, next, username = $bindable() }: Props = $props();

let captchaImage: string = $state("");

async function fetchCaptcha() {
	try {
		const response = await fetch("/api/erp/auth/captcha");

		if (!response.ok) {
			console.error("Failed to fetch captcha:", response.statusText);
			toast.error("Failed to load captcha image. Please try again later.", {
				duration: 5 * 1000,
			});
			return;
		}

		const data = await response.json();

		const savedErrors = $errors;

		$formData.token = data.token;
		$formData.captcha = "";

		setTimeout(() => {
			$errors = savedErrors;
		}, 0);

		captchaImage = data.image;
		const autoSolvedCaptcha = await solveCaptcha(captchaImage, 6);

		if (autoSolvedCaptcha) {
			const savedErrors = $errors;

			$formData.captcha = autoSolvedCaptcha;

			setTimeout(() => {
				$errors = savedErrors;
			}, 0);
		}
	} catch (error) {
		console.error("Error fetching captcha:", error);
		toast.error(
			"An error occurred while loading the captcha. Please try again later.",
			{
				duration: 5 * 1000,
			},
		);
	}
}

onMount(async () => {
	await fetchCaptcha();
});

const form = superForm(defaultForm, {
	validators: zod4Client(erpLoginFormSchema),
	clearOnSubmit: "none",
	onResult: async ({ result }) => {
		if (result.type === "failure" && result.status === 400) {
			fetchCaptcha();
		} else if (result.type === "success") {
			toast.success("ERP verified successfully! Proceeding to sign up...", {
				duration: 5 * 1000,
			});
			const action = result.data as FormResult<ActionData>;
			next(action);
		}
	},
});

const { form: formData, enhance, errors, constraints, submitting } = form;

let passwordVisible = $state(false);

$effect(() => {
	username = $formData.username;
});
</script>

<form method="POST" action="?/login" use:enhance class="space-y-6">

  <Form.Field {form} name="username">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Student ID</Form.Label>
        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiUserLine />
          </InputGroup.Addon>
          <InputGroup.Input 
            {...props}
            type="number"
            autocomplete="username"
            bind:value={$formData.username} 
            {...$constraints.username} 
          />
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>Must be the university student ID.</Form.Description>
    <Form.FieldErrors />
  </Form.Field>

  <Form.Field {form} name="password">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>ERP Password</Form.Label>

        <InputGroup.Root>
          <InputGroup.Addon align="inline-start">
                <RiLockPasswordLine />
          </InputGroup.Addon>
          <InputGroup.Input
            {...props}
            type={passwordVisible ? "text" : "password"}
            autocomplete="off"
            data-1p-ignore="true"
            data-lpignore="true" 
            data-protonpass-ignore="true"
            data-bwignore="true"
            data-form-type="other"
            bind:value={$formData.password}
            {...$constraints.password}
        />
        <InputGroup.Addon align="inline-end">
            <Button class="cursor-pointer" variant="ghost" size="icon" type="button" onclick={() => (passwordVisible = !passwordVisible)}>
              {#if passwordVisible}
                <RiEyeOffLine   />
              {:else}
                <RiEyeLine   />
              {/if}
            </Button>
        </InputGroup.Addon>
        </InputGroup.Root>
      {/snippet}
    </Form.Control>
    <Form.Description>
      Must be your ERP password.
    </Form.Description>
    <Form.FieldErrors />
  </Form.Field>



  <Form.Field {form} name="captcha">
    <Form.Control>
      {#snippet children({ props })}
        <Form.Label>Captcha</Form.Label>
          {#if captchaImage}
             <img src={captchaImage} alt="Captcha" class="w-full h-auto rounded mb-4" />
          {:else}
             <Skeleton class="w-full h-[113.4px] mb-4" />
          {/if}
        <div class="w-full flex items-center justify-center">
          <InputOTP.Root maxlength={6} {...props} bind:value={$formData.captcha} {...$constraints.captcha} >
            {#snippet children({ cells })}
              <InputOTP.Group>
                {#each cells as cell (cell)}
                  <InputOTP.Slot {cell} />
                {/each}
              </InputOTP.Group>
            {/snippet}
          </InputOTP.Root>

          <Button class="cursor-pointer" variant="ghost" size="icon" type="button" onclick={() => ($formData.captcha = "")}>
              <RiDeleteBinLine />
          </Button>
        </div>
      {/snippet}
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  
  <input name="token" type="hidden" bind:value={$formData.token} />
  
  {#if $submitting}
    <Form.Button type="submit" class="w-full cursor-progress" disabled>
        <Spinner/> Verifying...
    </Form.Button>
  {:else}
    <Form.Button type="submit" class="w-full cursor-pointer">
        Verify ERP
    </Form.Button>
  {/if}
  
</form >
