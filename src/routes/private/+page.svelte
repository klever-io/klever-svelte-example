<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import toast from 'svelte-french-toast';

	let loading = false;
	let addressError = '';
	let valueError = '';

	async function onSubmit(event: SubmitEvent) {
		loading = true;
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);

		const address = formData.get('address') as string | null;
		if (!address || address.length !== 62) {
			addressError = 'Address must be 62 characters long';
			loading = false;
			return;
		}
		if (addressError.length > 0) addressError = '';

		const value = formData.get('value') as string | null;
		if (!value || isNaN(Number(value))) {
			valueError = 'Value must be a number';
			loading = false;
			return;
		}

		const numberValue = Number(value);
		if (numberValue < 0) {
			valueError = 'Value must be positive';
			loading = false;
			return;
		}
		if (valueError.length > 0) valueError = '';

		try {
			const precision = 6;

			const payload = {
				receiver: address,
				amount: numberValue * 10 ** precision,
				kda: 'KLV'
			};

			const unsignedTransaction = await window.kleverWeb.buildTransaction([
				{
					payload,
					type: 0
				}
			]);

			const signedTransaction = await window.kleverWeb.signTransaction(unsignedTransaction);
			const { data, error } = await window.kleverWeb.broadcastTransactions([signedTransaction]);
			if (error.length > 0) {
				throw new Error(error);
			}

			const hash = data.txsHashes[0];

			toast(`Successfully send value!\n\nhttps://testnet.kleverscan.org/transaction/${hash}`, {
				position: 'bottom-end'
			});
		} catch (error) {
			toast(String(error), {
				style: 'background: #ef4444; color: #f8fafc;',
				position: 'bottom-end'
			});
		}

		loading = false;
	}
</script>

<form class="flex flex-col" method="POST" on:submit|preventDefault={onSubmit}>
	<label class="mt-2" for="address">Address</label>
	<Input name="address" id="address" />
	{#if addressError.length > 0}<p class="text-xs text-red-500">{addressError}</p>{/if}

	<label class="mt-2" for="value">Value</label>
	<Input name="value" id="value" />
	{#if valueError.length > 0}<p class="text-xs text-red-500">{valueError}</p>{/if}

	<Button type="submit" disabled={loading}>Send</Button>
</form>
