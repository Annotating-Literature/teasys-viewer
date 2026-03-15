<script lang="ts">
	import ThemeToggle from "./ThemeToggle.svelte";
	import { MAIN_NAV } from "$lib/config/navigation";
	let { user, availableTypes = [] } = $props();

	let activeDropdown = $state<string | null>(null);
	let isMobileMenuOpen = $state(false);

	const filteredNav = $derived(
		MAIN_NAV.map((item) => {
			if (item.label === "The Texts" && item.children) {
				return {
					...item,
					children: item.children.filter((child) => {
						if (child.label === "Poetry")
							return availableTypes.includes("poetry");
						if (child.label === "Drama")
							return availableTypes.includes("drama");
						if (child.label === "Prose")
							return availableTypes.includes("prose");
						return true;
					}),
				};
			}
			return item;
		}),
	);

	function toggleDropdown(label: string, e: MouseEvent) {
		e.preventDefault();
		activeDropdown = activeDropdown === label ? null : label;
	}

	function handleGlobalClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest(".nav-dropdown")) {
			activeDropdown = null;
		}
	}
</script>

<svelte:window onclick={handleGlobalClick} />

<header
	class="bg-surface-elevated/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 shadow-sm transition-colors"
>
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<div class="shrink-0 flex items-center gap-3">
				<a href="/" class="flex items-center gap-2 group">
					<div
						class="w-8 h-8 rounded-lg bg-linear-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-sm text-white"
					>
						<span
							class="text-white font-serif text-xl font-bold leading-none"
							>Θ</span
						>
					</div>
					<span
						class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors"
					>
						TEASys<span class="text-gray-500 font-normal"
							>Viewer</span
						>
					</span>
				</a>
			</div>

			<nav class="hidden md:flex items-center gap-6">
				{#each filteredNav as item}
					{#if item.children}
						<div class="relative nav-dropdown">
							<button
								onclick={(e) => toggleDropdown(item.label, e)}
								aria-expanded={activeDropdown === item.label}
								class="text-[15px] font-serif font-medium text-gray-600 hover:text-gray-900 transition-colors py-2 flex items-center gap-1 dark:text-gray-300 dark:hover:text-primary-400"
							>
								{item.label}
								<svg
									class="w-3.5 h-3.5 text-gray-400 transition-transform {activeDropdown ===
									item.label
										? 'rotate-180 text-gray-600'
										: ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									><path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/></svg
								>
							</button>
							{#if activeDropdown === item.label}
								<div
									class="absolute top-full left-0 mt-1 w-56 bg-surface-elevated rounded-xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 transition-all duration-200 origin-top-left z-50 overflow-hidden"
								>
									{#each item.children as child}
										<a
											href={child.href}
											class="block px-4 py-2.5 text-[14px] font-serif font-medium text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-gray-900 dark:hover:text-primary-300 transition-colors border-b border-gray-50 dark:border-white/5 last:border-0"
											onclick={() =>
												(activeDropdown = null)}
											>{child.label}</a
										>
									{/each}
								</div>
							{/if}
						</div>
					{:else}
						<a
							href={item.href}
							class="text-[15px] font-serif font-medium text-gray-600 hover:text-gray-900 transition-colors py-2 dark:text-gray-300 dark:hover:text-primary-400"
						>
							{item.label}
						</a>
					{/if}
				{/each}
			</nav>

			<div class="flex items-center gap-4">
				<ThemeToggle />

				<div class="hidden md:flex items-center gap-4">
					{#if user}
						<a
							href="/admin"
							class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors dark:text-gray-400 dark:hover:text-primary-400"
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
									class="text-[13px] font-semibold text-primary-700"
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
									class="text-sm font-medium text-gray-600 hover:text-red-500 transition-colors"
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

				<button
					class="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors dark:text-gray-300 dark:hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
					onclick={() => (isMobileMenuOpen = !isMobileMenuOpen)}
					aria-expanded={isMobileMenuOpen}
					aria-label="Toggle mobile menu"
				>
					<svg
						class="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						{#if isMobileMenuOpen}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						{:else}
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						{/if}
					</svg>
				</button>
			</div>
		</div>
	</div>

	{#if isMobileMenuOpen}
		<div
			class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-surface-elevated"
		>
			<div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				{#each filteredNav as item}
					{#if item.children}
						<div class="px-3 py-2">
							<div
								class="text-[15px] font-serif font-bold text-gray-900 dark:text-gray-100 mb-2"
							>
								{item.label}
							</div>
							<div
								class="space-y-1 pl-4 border-l-2 border-gray-100 dark:border-gray-800"
							>
								{#each item.children as child}
									<a
										href={child.href}
										class="block px-3 py-2 text-sm font-serif font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md transition-colors"
										onclick={() =>
											(isMobileMenuOpen = false)}
									>
										{child.label}
									</a>
								{/each}
							</div>
						</div>
					{:else}
						<a
							href={item.href}
							class="block px-3 py-2 text-[15px] font-serif font-bold text-gray-900 hover:text-primary-600 hover:bg-gray-50 dark:text-gray-100 dark:hover:text-primary-400 dark:hover:bg-gray-800 rounded-md transition-colors"
							onclick={() => (isMobileMenuOpen = false)}
						>
							{item.label}
						</a>
					{/if}
				{/each}

				<div
					class="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800"
				>
					{#if user}
						<div class="flex items-center gap-3 px-3 mb-3">
							<div
								class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center shrink-0"
							>
								<span
									class="text-sm font-semibold text-primary-700"
								>
									{user.username[0].toUpperCase()}
								</span>
							</div>
							<div
								class="text-sm font-medium text-gray-900 dark:text-gray-100"
							>
								{user.username}
							</div>
						</div>
						<a
							href="/admin"
							class="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 rounded-md transition-colors"
							onclick={() => (isMobileMenuOpen = false)}
						>
							Admin Dashboard
						</a>
						<form action="/logout" method="POST" class="mt-1">
							<button
								type="submit"
								class="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-md transition-colors"
							>
								Sign out
							</button>
						</form>
					{:else}
						<a
							href="/login"
							class="block w-full text-center px-4 py-2 mt-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
							onclick={() => (isMobileMenuOpen = false)}
						>
							Sign in
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</header>
