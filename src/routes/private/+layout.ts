import { account } from '$lib/store';
import { redirect } from '@sveltejs/kit';

export function load() {
	let address: string | null = null;
	account.subscribe((value) => {
		address = value;
	});

	if (address === null) {
		throw redirect(303, '/');
	}

	return {
		address
	};
}
