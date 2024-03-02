<script lang="ts">
	import { Select as SelectPrimitive } from 'bits-ui';
	import HamburgerMenu from 'svelte-radix/HamburgerMenu.svelte';
	import { cn } from '$lib/utils';

	type $$Props = SelectPrimitive.TriggerProps;
	type $$Events = SelectPrimitive.TriggerEvents;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<SelectPrimitive.Trigger
	class={cn(
		'flex h-10 w-full items-center justify-between  border-input   text-sm ring-offset-background placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
		className
	)}
	{...$$restProps}
	let:builder
	on:click
	on:keydown
>
	<slot {builder} />
	<div>
		<HamburgerMenu class="h-6 w-6" />
	</div>
</SelectPrimitive.Trigger>
