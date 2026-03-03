<script lang="ts">
	let { user } = $props();
</script>

<header
	class="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-100 shadow-sm"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<div class="shrink-0 flex items-center gap-3">
				<a href="/" class="flex items-center gap-2 group">
					<div
						class="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm text-white"
					>
						<span
							class="text-white font-serif text-xl font-bold"
							style="margin-top: -2px;">Θ</span
						>
					</div>
					<span
						class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
					>
						TEASys<span class="text-gray-500 font-normal"
							>Viewer</span
						><span
							class="inline-flex items-center ml-1.5 px-1.5 py-0.5 rounded text-[11px] font-medium text-gray-500 bg-gray-100 leading-none"
							>v3α</span
						>
					</span>
				</a>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="/authors"
					class="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
				>
					Authors
				</a>
				{#if user}
					<a
						href="/admin"
						class="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
					>
						Admin
					</a>

					<div
						class="flex items-center gap-3 pl-3 border-l border-gray-200"
					>
						<div
							class="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center"
						>
							<span
								class="text-xs font-semibold text-primary-700"
							>
								{user.username[0].toUpperCase()}
							</span>
						</div>
						<span class="text-sm text-gray-600">
							{user.username}
						</span>
						<form action="/logout" method="POST">
							<button
								type="submit"
								class="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
							>
								Sign out
							</button>
						</form>
					</div>
				{:else}
					<a
						href="/login"
						class="text-sm font-medium text-primary-600 hover:text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-50 transition-all"
					>
						Sign in
					</a>
				{/if}
			</div>
		</div>
	</div>
</header>
