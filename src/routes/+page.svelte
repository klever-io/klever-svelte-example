<script lang="ts">
	import { goto } from '$app/navigation';
	import { signMessage } from '$lib';
	import Button from '$lib/components/Button.svelte';
	import { account } from '$lib/store';
	import toast from 'svelte-french-toast';

	let loading = false;

	async function onSubmit(event: SubmitEvent) {
		event.preventDefault();
		loading = true;

		try {
			if (typeof window === 'undefined' || !window.kleverWeb) {
				throw Error('Klever Extension not found');
			}

			await window.kleverWeb.initialize();
			const address = window.kleverWeb.getWalletAddress();
			if (!address) {
				throw Error('Cannot retrieve wallet address');
			}

			const message = await window.kleverWeb.signMessage(signMessage);
			const result = await window.kleverWeb.validateSignature(signMessage, message, address);

			if (!result) {
				throw Error('Invalid signature');
			}

			account.set(address);

			goto('/private');
		} catch (error) {
			toast(String(error), {
				style: 'background: #ef4444; color: #f8fafc;',
				position: 'bottom-end'
			});
		}

		loading = false;
	}
</script>

<main class="w-screen h-screen flex items-center justify-center">
	<form on:submit={onSubmit} class="max-w-xs p-4 border border-slate-300 rounded-md shadow-sm">
		<div>
			<h1 class="font-bold text-lg">Klever Extension Playground</h1>
			<h3 class="text-sm">Sign in with extension</h3>
		</div>
		<div class="mt-2 mb-6 h-[1px] w-full bg-slate-300" />

		<Button disabled={loading} type="submit">Sign in</Button>
	</form>
</main>
