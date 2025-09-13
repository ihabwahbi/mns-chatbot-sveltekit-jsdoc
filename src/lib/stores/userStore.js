import { writable } from 'svelte/store';

/**
 * Store for managing authenticated user information
 * @type {import('svelte/store').Writable<{
 *   identityProvider: string,
 *   userId: string,
 *   userDetails: string,
 *   userRoles: string[],
 *   claims?: Array<{typ: string, val: string}>
 * } | null>}
 */
export const userStore = writable(null);

/**
 * Store for tracking authentication loading state
 * @type {import('svelte/store').Writable<boolean>}
 */
export const authLoading = writable(true);