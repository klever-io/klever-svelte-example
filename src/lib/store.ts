import { writable } from 'svelte/store';

export const account = writable<string | null>(null);
