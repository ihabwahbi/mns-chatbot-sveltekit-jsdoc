<script lang="ts">
	// @ts-nocheck
	import * as Menubar from '$lib/components/ui/menubar';
	import HamburgerMenu from 'svelte-radix/HamburgerMenu.svelte';
	let bookmarks = false;
	let fullUrls = true;
	import { onMount, onDestroy } from 'svelte';

	let isOpen = false;

	const profileRadioValue = 'benoit';
	import { goto } from '$app/navigation';
	import AnimatedHamburger from './AnimatedHamburger.svelte';

	function handleClickOutside(event) {
		// Check if the click is outside the Hamburger button
		if (!event.target.closest('.hamburger')) {
			isOpen = false;
		}
	}

	onMount(() => {
		window.addEventListener('click', handleClickOutside);
	});
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger><AnimatedHamburger bind:isOpen /></Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item on:click={() => goto('/')}>
				Home <Menubar.Shortcut></Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item on:click={() => goto('/about')}>
				About <Menubar.Shortcut></Menubar.Shortcut>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
