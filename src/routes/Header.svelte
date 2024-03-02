<script>
	let isOpen = false;
	import Menubar from './Menubar.svelte';
	import AnimatedHamburger from './AnimatedHamburger.svelte';
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

			<!-- mobile button goes here -->
			<div class="flex items-center md:hidden"><Menubar /></div>
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
	</div>
</nav>
