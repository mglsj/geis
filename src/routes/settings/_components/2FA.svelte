<script lang="ts" module>
export type TwoFactorData = {
	totpURI: string;
	backupCodes: string[];
};
</script>

<script lang="ts">
import TwoFactorAuthForm from "./2FAForm.svelte";
import TwoFactorAuthQr from "./2FAQr.svelte";

let twoFactorData: TwoFactorData | null = $state(null);
</script>

{#if twoFactorData}
	<TwoFactorAuthQr bind:twoFactorData />
{:else}
	<TwoFactorAuthForm bind:twoFactorData />
{/if}