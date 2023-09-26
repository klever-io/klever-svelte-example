<script>
	import Button from '$lib/components/Button.svelte';
	import { account } from '$lib/store';
	import toast from 'svelte-french-toast';

	let address = '';
	account.subscribe((value) => {
		address = value ?? '';
	});

	function getTruncateAddress(size = 15) {
		const firstPart = address.slice(0, size);
		const lastPart = address.slice(-size);

		return `${firstPart}...${lastPart}`;
	}

	function handleCopy() {
		navigator.clipboard.writeText(address);
		toast('Address copied to clipboard');
	}
</script>

<div class="flex flex-col">
	<span class="text-sm text-slate-500">Your address:</span>
	<span class="font-bold">{getTruncateAddress()}</span>
	<Button on:click={handleCopy}>Copy</Button>
</div>
