<script>
	// @ts-nocheck

	import Header from './Header.svelte';
	import { tick } from 'svelte';
	// You might import a Chat component here if you have one,
	// or directly implement chat logic in this script block.

	function autoResize(event) {
		if (!event.target.dataset.originalHeight) {
			event.target.dataset.originalHeight = event.target.style.height || '3rem';
		}
		const minHeight = '3rem'; // Adjust this to match your textarea's original height
		event.target.style.height = 'auto'; // Reset height to ensure accurate measurement
		const newHeight = Math.max(event.target.scrollHeight, parseFloat(minHeight) * 16); // Calculate new height, ensure it's not less than minHeight
		event.target.style.height = newHeight + 'px'; // Set new height based on scroll height or minimum height
	}
	let userMessage = ''; // To hold the input from the user
	let submittedMessage = '';
	/**
	 * Represents a message with a sender and content.
	 * @typedef {{ sender: string, content: string }} Message
	 */

	/** @type {Message[]} - An array of message objects. */
	let messages = []; // To store all messages displayed on the screen
	let startChat = false;
	let isLoading = false;

	async function handleSubmit() {
		const textarea = document.getElementById('chatInput');
		if (textarea && textarea.dataset.originalHeight) {
			textarea.style.height = textarea.dataset.originalHeight;
		}

		isLoading = true;
		submittedMessage = userMessage;
		userMessage = '';
		if (!submittedMessage.trim()) {
			console.error('The message is empty.');
			// Update your UI to inform the user or return to exit the function early
			return;
		} // Prevent sending empty messages
		// Add the user's message to the messages array
		startChat = true;
		messages = [...messages, { sender: 'You', content: submittedMessage }];
		await tick(); // Wait for the DOM to update
		scrollToBottom(); // Scroll to the bottom of the chat
		// Clear the input field after submitting
		// Specify the API URL
		const apiUrl =
			'https://mns-chatbot-backend.azurewebsites.net/api/mns-chatbot-function?code=tp9MuKM6kSVavitcJSBwvflu0-fZNS7dQiBGhvm9ur7LAzFu46AbcA==';
		try {
			// Start the POST request to the API
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: submittedMessage.trim() }) // Ensure userMessage is correctly sent as 'prompt'
			});

			if (!response.ok) {
				console.error('API call failed:', response.statusText);
				// Optionally, read and log the response text for more details
				const errorText = await response.text();
				console.error('Error details:', errorText);
				return; // Exit early since the API call failed
			}

			let data;
			if (response.ok) {
				data = await response.json(); // Parse once
				messages = [...messages, { sender: 'AI Assistant', content: data.message }];
				await tick(); // Wait for the DOM to update
				scrollToBottom(); // Scroll to the bottom of the chat
			} else {
				// Handle non-OK responses without trying to parse JSON
				console.error('API call failed:', response.statusText);
				// Read response as text or handle accordingly
			}
			// Update the messages array with the response
		} catch (error) {
			console.error(error);
			// Update the UI to show the error message to the user
		} finally {
			isLoading = false; // Stop loading regardless of success or error
		}
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault(); // Stop the textarea from creating a new line
			handleSubmit();
		}
	}
	function scrollToBottom() {
		const chatContainer = document.querySelector('.flex.flex-grow.overflow-auto'); // Adjust the selector as needed
		chatContainer.scrollTop = chatContainer.scrollHeight;
	}
</script>

<main class="flex h-[calc(100dvh)] flex-col">
	<Header />

	<div class="flex flex-grow justify-center overflow-auto bg-gradient-to-b from-cee5fd to-white">
		{#if !startChat}
			<div class="flex flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
				<p class="mx-auto -mt-4 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
					Welcome to
					<span class="border-b border-dotted border-slate-300">the future</span>
				</p>

				<h1
					class="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl"
				>
					<span class="inline-block"
						>M&S
						<span class="relative whitespace-nowrap text-slbBlue">
							<svg
								aria-hidden="true"
								viewBox="0 0 418 42"
								class="absolute left-0 top-2/3 h-[0.58em] w-full fill-slbBlue/70"
								preserveAspectRatio="none"
								><path
									d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"
								></path></svg
							>
							<span class="relative">AI</span></span
						>
					</span>
					<span class="inline-block">Assistant</span>
				</h1>

				<p class="mx-auto mt-9 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
					<span class="inline-block">Empower Your Decisions with M&S AI Assistant:</span>
					<span class="inline-block">Where Insight Meets Innovation.</span>
				</p>
			</div>
		{/if}
		{#if startChat}
			<div class="w-full p-4 md:w-1/2">
				{#each messages as message}
					<div><strong>{message.sender}:</strong> {message.content}</div>
				{/each}
				{#if isLoading}
					<div><strong>AI Assistant:</strong></div>
					<div class="flex animate-pulse space-x-4">
						<div class="flex-1 space-y-6 py-1">
							<div class="h-2 rounded bg-slate-400"></div>
							<div class="space-y-3">
								<div class="grid grid-cols-3 gap-4">
									<div class="col-span-2 h-2 rounded bg-slate-400"></div>
									<div class="col-span-1 h-2 rounded bg-slate-400"></div>
								</div>
								<div class="h-2 rounded bg-slate-400"></div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Input field and Send button at the bottom -->

	<div class=" flex items-center justify-center bg-white p-2 md:p-4">
		<div class="relative flex w-full md:w-1/2">
			<textarea
				id="chatInput"
				on:input={autoResize}
				class="flex w-full resize-none items-center justify-center rounded-3xl border-2 border-gray-300 bg-gray-100 py-2.5 pl-4 pr-10 text-gray-700 focus:border-slbBlue focus:bg-white focus:outline-none"
				rows="1"
				placeholder="Ask me anything..."
				style="overflow:hidden; max-height: 500px; min-height: 3rem;"
				bind:value={userMessage}
				on:keydown={handleKeyDown}
				disabled={isLoading}
			></textarea>
			<button
				class="absolute inset-y-0 right-2 flex items-center justify-center px-3 text-slbBlue"
				type="submit"
				on:click={handleSubmit}
			>
				<!-- Adjusted px-3 for padding, ensures the button is centered -->
				{#if isLoading}
					<svg
						aria-hidden="true"
						class="h-6 w-6 animate-spin fill-slbBlue text-gray-200"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5" />
						<path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 7.5-7.5 7.5 7.5" />
					</svg>
				{/if}
			</button>
		</div>
	</div>
</main>
