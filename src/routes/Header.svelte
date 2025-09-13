<script>
	let isOpen = false;
	import Menubar from './Menubar.svelte';
	import AnimatedHamburger from './AnimatedHamburger.svelte';
	import { userStore } from '$lib/stores/userStore';
</script>

<nav class="bg-slbBlue text-white">
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex justify-between">
			<div class="flex space-x-4">
				<!-- logo -->
				<div class="flex items-center space-x-1">
					<img src="/SLB_BIG.png" alt="SLB Logo" class="mx-2 w-12" />
				</div>

				<!-- primary nav -->
				<div class="hidden items-center space-x-1 md:flex">
					<a
						href="/"
						class="px-3 py-4 text-white no-underline hover:text-gray-200 hover:no-underline">Home</a
					>
					<a
						href="/about"
						class="px-3 py-4 text-white no-underline hover:text-gray-200 hover:no-underline"
						>About</a
					>
					<!-- Add more navigation links as needed -->
				</div>
			</div>

			<!-- User info and logout -->
			<div class="flex items-center space-x-4">
				{#if $userStore}
					<div class="hidden items-center space-x-3 md:flex">
						<span class="text-sm">Welcome, {$userStore.userDetails}</span>
						<a
							href="/.auth/logout?post_logout_redirect_uri=/"
							class="rounded bg-white/20 px-3 py-1 text-sm text-white hover:bg-white/30"
							data-sveltekit-preload-data="off"
						>
							Logout
						</a>
					</div>
				{/if}
				<!-- mobile button goes here -->
				<div class="flex items-center md:hidden"><Menubar /></div>
			</div>
		</div>
	</div>

	<!-- mobile menu -->
	<div class="md:hidden" class:hidden={!isOpen}>
		<a href="/" class="px-3 py-4 text-white no-underline hover:text-gray-200 hover:no-underline"
			>Home</a
		>
		<a
			href="/about"
			class="px-3 py-4 text-white no-underline hover:text-gray-200 hover:no-underline">About</a
		>
		{#if $userStore}
			<div class="border-t border-white/20 px-3 py-2">
				<div class="text-sm">Welcome, {$userStore.userDetails}</div>
				<a
					href="/.auth/logout?post_logout_redirect_uri=/"
					class="mt-2 block text-sm text-white hover:text-gray-200"
					data-sveltekit-preload-data="off"
				>
					Logout
				</a>
			</div>
		{/if}
	</div>
</nav>
