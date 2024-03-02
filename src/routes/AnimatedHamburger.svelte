<script>
	export let isOpen = false;
</script>

<button on:click={() => (isOpen = !isOpen)} class="hamburger" aria-label="Menu">
	<div class={isOpen ? 'bar top' : 'bar'}></div>
	<div class={isOpen ? 'bar middle' : 'bar'}></div>
	<div class={isOpen ? 'bar bottom' : 'bar'}></div>
</button>

<style>
	.hamburger {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		width: 25px;
		height: 25px;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		box-sizing: border-box;
	}

	.hamburger:focus {
		outline: none;
	}

	.bar {
		width: 100%;
		height: 3px;
		background-color: white;
		transition: all 0.3s linear;
		position: relative;
		transform-origin: 1px; /* Adjust this line */
	}

	.top {
		transform: rotate(45deg);
	}

	.middle {
		opacity: 0;
	}

	.bottom {
		transform: rotate(-45deg);
	}
</style>
