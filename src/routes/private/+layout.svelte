<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import { account } from '$lib/store';
	import { ArrowDownToLine, LogOut, Send } from 'lucide-svelte';

	let amount = 0;
	let precision = 6;

	account.subscribe(async (value) => {
		if (!value || value.length !== 62) {
			return;
		}

		const request = await fetch(window.kleverWeb.provider.api + '/v1.0/address/' + value);
		const response = await request.json();
		if (response.error) {
			return;
		}

		amount = response.data.account.balance;
	});

	function handleLogout() {
		account.set(null);
	}
</script>

<main class="w-screen h-screen flex items-center justify-center">
	<div class="p-4 border border-slate-300 rounded-md shadow-sm">
		<div class="flex items-center justify-between gap-4">
			<div>
				<h1 class="font-bold text-lg">Private Page</h1>
				<h3 class="text-sm">Make transactions or receive any value</h3>
			</div>
			<form>
				<a href="/">
					<Button type="submit" on:click={handleLogout}>
						<LogOut class="w-4 h-4" />
					</Button>
				</a>
			</form>
		</div>

		<div class="mt-2 h-[1px] w-full bg-slate-300" />

		<div class="mt-2 mb-6">
			<span class="text-sm"
				>Amount: <strong class="text-md font-medium"
					>{(amount / 10 ** precision).toFixed(2)}KLV</strong
				></span
			>
		</div>

		<div class="grid grid-cols-2 gap-2">
			<a href="/private">
				<div
					class="pt-4 pb-3 rounded-md flex flex-col items-center justify-center border border-slate-300 hover:bg-slate-300"
				>
					<Send strokeWidth={1.5} class="w-5 h-5" />
					<span class="text-sm">Send</span>
				</div>
			</a>
			<a href="/private/receive">
				<div
					class="pt-4 pb-3 rounded-md flex flex-col items-center justify-center border border-slate-300 hover:bg-slate-300"
				>
					<ArrowDownToLine class="w-5 h-5" />
					<span class="text-sm">Receive</span>
				</div>
			</a>
		</div>

		<div class="my-4">
			<slot />
		</div>
	</div>
</main>
