<script>
	import '../app.pcss';
	import { userStore, authLoading } from '$lib/stores/userStore';
	import { onMount } from 'svelte';

	/** @type {import('./$types').LayoutServerData} */
	export let data;

	// Update the user store with server-side data
	$: if (data?.user) {
		userStore.set(data.user);
		authLoading.set(false);
	} else if (data?.user === null) {
		authLoading.set(false);
	}

	// Handle client-side authentication check for SPA navigation
	onMount(() => {
		if (!data?.user) {
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
