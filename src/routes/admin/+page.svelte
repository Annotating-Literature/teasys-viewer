<script lang="ts">
	import type { PageData } from "./$types";
	import { CATEGORY_META } from "$lib/constants";
	import IconQuill from "$lib/components/icons/IconQuill.svelte";
	import IconNotebook from "$lib/components/icons/IconNotebook.svelte";
	import IconTheatreMasks from "$lib/components/icons/IconTheatreMasks.svelte";

	let { data } = $props();

	const texts = $derived(data.textsWithAnnotations ?? []);

	// Stats
	const totalTexts = $derived(texts.length);
	const totalAnnotations = $derived(
		texts.reduce((sum, t) => sum + t.annotations.length, 0),
	);

	// By type
	const byType = $derived.by(() => {
		const counts: Record<string, number> = {
			poetry: 0,
			prose: 0,
			drama: 0,
		};
		for (const t of texts) counts[t.type] = (counts[t.type] || 0) + 1;
		return counts;
	});

	// By category (tag)
	const byCategory = $derived.by(() => {
		const groups: Record<string, typeof texts> = {};
		for (const t of texts) {
			const cat = t.category || "Uncategorized";
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(t);
		}
		return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
	});

	// By author
	const byAuthor = $derived.by(() => {
		const groups: Record<string, typeof texts> = {};
		for (const t of texts) {
			const auth = t.author || "Unknown";
			if (!groups[auth]) groups[auth] = [];
			groups[auth].push(t);
		}
		return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
	});

	const typeLabel: Record<string, string> = {
		poetry: "Poetry",
		prose: "Prose",
		drama: "Drama",
	};
</script>

<svelte:head>
	<title>Admin — TEASys Viewer</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-10">
	<div class="mb-8">
		<a
			href="/"
			class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-4"
		>
			← Library
		</a>
		<h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
	</div>

	<!-- Quick stats -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
			<p
				class="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1"
			>
				<svg
					class="w-3.5 h-3.5"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.3"
					><rect x="2" y="1" width="12" height="14" rx="1" /><path
						d="M5 4h6M5 7h6M5 10h4"
					/></svg
				>
				Texts
			</p>
			<p class="text-2xl font-bold text-gray-900">{totalTexts}</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
			<p
				class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1"
			>
				Annotations
			</p>
			<p class="text-2xl font-bold text-gray-900">{totalAnnotations}</p>
		</div>
		{#each ["poetry", "prose", "drama"] as type}
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
			>
				<p
					class="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1"
				>
					{#if type === "poetry"}
						<IconQuill class="w-3.5 h-3.5" />
					{:else if type === "prose"}
						<IconNotebook class="w-3.5 h-3.5" />
					{:else}
						<IconTheatreMasks class="w-3.5 h-3.5" />
					{/if}
					{typeLabel[type]}
				</p>
				<p class="text-2xl font-bold text-gray-900">
					{byType[type] || 0}
				</p>
			</div>
		{/each}
	</div>

	<!-- Management links -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
		<a
			href="/admin/texts"
			class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"
		>
			<div
				class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					><rect x="3" y="2" width="14" height="16" rx="1.5" /><path
						d="M7 6h6M7 9h6M7 12h4"
					/></svg
				>
			</div>
			<h2
				class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors"
			>
				Manage Texts
			</h2>
			<p class="text-xs text-gray-500 mt-0.5">
				Add and remove literary texts
			</p>
		</a>
	{#if data.user?.role === "admin"}
		<a
			href="/admin/users"
			class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"
		>
			<div
				class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					><circle cx="10" cy="7" r="3.5" /><path
						d="M3.5 17c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5"
					/></svg
				>
			</div>
			<h2
				class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors"
			>
				Manage Users
			</h2>
			<p class="text-xs text-gray-500 mt-0.5">
				Add and remove editor accounts
			</p>
		</a>
	{/if}
	</div>

	<!-- By Category -->
	{#if byCategory.length > 0}
		<div class="mb-8">
			<h2 class="text-sm font-semibold text-gray-900 mb-3">
				By Category
			</h2>
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
			>
				{#each byCategory as [category, categoryTexts], i}
					<div class="p-4 {i > 0 ? 'border-t border-gray-50' : ''}">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-sm font-medium text-gray-800">
								{category}
							</h3>
							<span
								class="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full"
							>
								{categoryTexts.length} text{categoryTexts.length !==
								1
									? "s"
									: ""}
							</span>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each categoryTexts as t}
								<a
									href={`/texts/${t.id}`}
									class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
								>
									<span
										class="text-[10px] text-gray-400 font-medium"
										>{t.type}</span
									>
									<span class="font-medium">{t.title}</span>
									{#if t.annotations.length > 0}
										<span class="text-gray-400"
											>· {t.annotations.length} ann.</span
										>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- By Author -->
	{#if byAuthor.length > 0}
		<div>
			<h2 class="text-sm font-semibold text-gray-900 mb-3">By Author</h2>
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
			>
				{#each byAuthor as [author, authorTexts], i}
					<div class="p-4 {i > 0 ? 'border-t border-gray-50' : ''}">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-sm font-medium text-gray-800">
								{author}
							</h3>
							<span
								class="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full"
							>
								{authorTexts.length} text{authorTexts.length !==
								1
									? "s"
									: ""}
							</span>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each authorTexts as t}
								<a
									href={`/texts/${t.id}`}
									class="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
								>
									<span
										class="text-[10px] text-gray-400 font-medium"
										>{t.type}</span
									>
									<span class="font-medium">{t.title}</span>
									{#if t.annotations.length > 0}
										<span class="text-gray-400"
											>· {t.annotations.length} ann.</span
										>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
