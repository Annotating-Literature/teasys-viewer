<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	let { form } = $props();
</script>

<Seo title="Sign in" noindex={true} />

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="text-center mb-8">
			<div
				class="w-12 h-12 mx-auto mb-4 rounded-xl bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md"
			>
				<span
					class="text-white font-serif text-xl font-bold"
					style="margin-top: -2px;">Θ</span
				>
			</div>
			<h1 class="text-2xl font-semibold text-gray-900">Welcome back</h1>
			<p class="mt-1 text-m text-gray-500">Sign in to annotate texts</p>
		</div>

		<!-- Form card -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
			<form class="space-y-4" method="POST">
				<div>
					<label
						for="username"
						class="block text-m font-medium text-gray-700 mb-1.5"
						>Username</label
					>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="w-full px-3.5 py-2.5 text-m border border-gray-200 rounded-lg
						       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
						       transition-all placeholder:text-gray-500"
						placeholder="Enter username"
					/>
				</div>
				<div>
					<label
						for="password"
						class="block text-m font-medium text-gray-700 mb-1.5"
						>Password</label
					>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="w-full px-3.5 py-2.5 text-m border border-gray-200 rounded-lg
						       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
						       transition-all placeholder:text-gray-500"
						placeholder="Enter password"
					/>
				</div>

				{#if form?.error}
					<div
						class="bg-red-50 text-red-600 text-m rounded-lg px-3 py-2 text-center"
					>
						{form.error}
					</div>
				{/if}

				<button
					type="submit"
					class="w-full py-2.5 px-4 text-m font-medium text-white bg-primary-600
					       hover:bg-primary-700 rounded-lg shadow-sm transition-colors
					       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
				>
					Sign in
				</button>
			</form>
		</div>

		<p class="mt-6 text-center text[13px] text-gray-500">
			<a
				href="/"
				class="inline-flex items-center gap-1 hover:text-primary-600 transition-colors"
				><svg
					class="w-3 h-3"
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"><path d="M9 11L5 7l4-4" /></svg
				> Back to library</a
			>
		</p>
	</div>
</div>
