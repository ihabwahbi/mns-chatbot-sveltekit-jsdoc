<script>
	import Header from '../Header.svelte';
	import { fade } from 'svelte/transition';
</script>

<svelte:head>
	<title>About</title>
	<meta name="description" content="About this app" />
</svelte:head>

<main class="flex h-[calc(100dvh)] flex-col">
	<Header />

	<div
		in:fade={{ duration: 400 }}
		class="flex justify-center overflow-auto bg-gradient-to-b from-cee5fd to-white"
	>
		<div class="mx-auto max-w-7xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8 lg:pt-32">
			<p class="mx-auto -mt-4 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
				Welcome to
				<span class="border-b border-dotted border-slate-300">the future</span>
			</p>

			<h1
				class="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl"
			>
				<span class="inline-block"
					>EchoEngine
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
						<span class="relative">M&S</span></span
					>
				</span>
			</h1>

			<h2 class="mx-auto mt-9 max-w-2xl text-lg tracking-tight text-slate-700 sm:mt-6">
				<span class="inline-block">Empower Your Decisions with M&S EchoEngine:</span>
				<span class="inline-block">Where Insight Meets Innovation.</span>
			</h2>

			<div
				class="space-between mt-12 flex flex-col gap-y-5 sm:mt-10 sm:flex-row sm:gap-x-6 sm:gap-y-2"
			>
				<a
					href="#"
					class="block max-w-sm rounded-lg border border-gray-200 bg-blue-50 p-6 shadow hover:bg-gray-100"
				>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
						Real-Time Demand and Supply Insights
					</h5>
					<p class="font-normal text-gray-700">
						The EchoEngine M&S chatbot revolutionizes how businesses interact with their supply
						chain data, offering immediate access to vital demand and supply information. Powered by
						sophisticated AI algorithms, it delivers accurate, up-to-the-minute insights on
						inventory levels, order statuses, and material availability. This tool empowers users to
						make quick, data-driven decisions, enhancing operational efficiency and responsiveness
						to market demands.
					</p>
				</a>
				<a
					href="#"
					class="block max-w-sm rounded-lg border border-gray-200 bg-blue-50 p-6 shadow hover:bg-gray-100"
				>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
						Intelligent Analytics & Forecasting
					</h5>
					<p class="font-normal text-gray-700">
						EchoEngine M&S goes beyond real-time data, employing advanced analytics to predict
						future market trends and demand-supply mismatches. It analyzes historical data patterns
						and current market signals to forecast future needs, helping businesses proactively
						adjust their strategies. By anticipating changes and planning accordingly, companies can
						optimize inventory, reduce costs, and avoid stockouts or excesses, ensuring they meet
						customer needs while maintaining lean operations.
					</p>
				</a>
				<a
					href="#"
					class="mb-4 block max-w-sm rounded-lg border border-gray-200 bg-blue-50 p-6 shadow hover:bg-gray-100"
				>
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
						Seamless Integration & User Experience
					</h5>
					<p class="font-normal text-gray-700">
						Designed with the user in mind, EchoEngine M&S seamlessly integrates into existing ERP
						and SCM systems, facilitating a unified and efficient workflow. Its intuitive interface
						simplifies complex data, making sophisticated supply chain analytics accessible to all
						team members, regardless of their technical expertise. Customizable features allow
						businesses to tailor the chatbot to their unique operational requirements, ensuring a
						personalized and effective supply chain management solution.
					</p>
				</a>
			</div>
		</div>
	</div>
</main>
