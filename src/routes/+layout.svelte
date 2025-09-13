<script>
	import '../app.pcss';
	import { userStore, authLoading } from '$lib/stores/userStore';
	import { onMount } from 'svelte';

	/** @type {import('./$types').LayoutServerData} */
	export let data;

	// PREVIEW MODE - Same as in +layout.server.js
	const PREVIEW_MODE = true;

	// Update the user store with server-side data
	$: if (data?.user) {
		userStore.set(data.user);
		authLoading.set(false);
	} else if (data?.user === null) {
		authLoading.set(false);
	}

	// Handle client-side authentication check for SPA navigation
	onMount(() => {
		// In preview mode, always use mock user
		if (PREVIEW_MODE) {
			userStore.set({
				identityProvider: 'mock',
				userId: 'preview-user',
				userDetails: 'Preview User',
				userRoles: ['anonymous', 'authenticated'],
				claims: []
			});
			authLoading.set(false);
		} else if (!data?.user) {
			// Double-check authentication on client side
			fetch('/.auth/me')
				.then(res => res.json())
				.then(authData => {
					if (authData?.clientPrincipal) {
						userStore.set(authData.clientPrincipal);
					}
					authLoading.set(false);
				})
				.catch(() => {
					authLoading.set(false);
				});
		}
	});
</script>

<svelte:head>
	<title>EchoEngine M&S</title>
	<link rel="icon" href="/favicon.png" type="image/png" />
</svelte:head>

<slot />
