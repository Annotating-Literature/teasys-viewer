<script lang="ts">
	let { form } = $props();
</script>

<svelte:head>
	<title>Sign in — TEASys Viewer</title>
</svelte:head>

<div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
	<div class="w-full max-w-sm">
		<!-- Logo -->
		<div class="text-center mb-8">
			<div
				class="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md"
			>
				<span class="text-white font-bold text-xl">T</span>
			</div>
			<h1 class="text-2xl font-semibold text-gray-900">Welcome back</h1>
			<p class="mt-1 text-sm text-gray-500">Sign in to annotate texts</p>
		</div>

		<!-- Form card -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
			<form class="space-y-4" method="POST">
				<div>
					<label
						for="username"
						class="block text-sm font-medium text-gray-700 mb-1.5"
						>Username</label
					>
					<input
						id="username"
						name="username"
						type="text"
						required
						class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg
						       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
						       transition-all placeholder:text-gray-400"
						placeholder="Enter username"
					/>
				</div>
				<div>
					<label
						for="password"
						class="block text-sm font-medium text-gray-700 mb-1.5"
						>Password</label
					>
					<input
						id="password"
						name="password"
						type="password"
						required
						class="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg
						       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
						       transition-all placeholder:text-gray-400"
						placeholder="Enter password"
					/>
				</div>

				{#if form?.error}
					<div
						class="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 text-center"
					>
						{form.error}
					</div>
				{/if}

				<button
					type="submit"
					class="w-full py-2.5 px-4 text-sm font-medium text-white bg-primary-600
					       hover:bg-primary-700 rounded-lg shadow-sm transition-colors
					       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:ring-offset-2"
				>
					Sign in
				</button>
			</form>
		</div>

		<p class="mt-6 text-center text-xs text-gray-400">
			<a href="/" class="hover:text-primary-600 transition-colors"
				>← Back to library</a
			>
		</p>
	</div>
</div>
