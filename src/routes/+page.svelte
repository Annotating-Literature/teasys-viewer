<script lang="ts">
	import type { PageData } from "./$types";
	import IconQuill from "$lib/components/icons/IconQuill.svelte";
	import IconNotebook from "$lib/components/icons/IconNotebook.svelte";
	import IconTheatreMasks from "$lib/components/icons/IconTheatreMasks.svelte";

	let { data } = $props();

	const typeOrder = ["poetry", "prose", "drama"] as const;
	const typeLabel: Record<string, string> = {
		poetry: "Poetry",
		prose: "Prose",
		drama: "Drama",
	};

	// Group texts: type → category → texts
	const groupedByType = $derived.by(() => {
		const result: {
			type: string;
			categories: { name: string; texts: any[] }[];
		}[] = [];
		for (const type of typeOrder) {
			const textsOfType = (data.groupedTexts[type] ?? []) as any[];
			if (textsOfType.length === 0) continue;
			// Group by category within type
			const catMap: Record<string, any[]> = {};
			for (const t of textsOfType) {
				const cat = t.category || "Uncategorized";
				if (!catMap[cat]) catMap[cat] = [];
				catMap[cat].push(t);
			}
			const categories = Object.entries(catMap)
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([name, texts]) => ({ name, texts }));
			result.push({ type, categories });
		}
		return result;
	});

	const hasTexts = $derived(
		!Object.values(data.groupedTexts).every(
			(arr: any[]) => arr.length === 0,
		),
	);
</script>

<svelte:head>
	<title>TEASys Viewer — Annotated Literature</title>
	<meta
		name="description"
		content="Explore and annotate literary texts collaboratively with TEASys Viewer."
	/>
</svelte:head>

<!-- Hero -->
<div class="relative overflow-hidden">
	<div
		class="absolute inset-0 bg-linear-to-br from-primary-50 via-white to-primary-50/30"
	></div>
	<div class="relative max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
		<h1
			class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 text-balance font-serif"
		>
			Annotated Literature
		</h1>
		<p
			class="mt-4 text-lg text-gray-500 max-w-xl mx-auto text-balance leading-relaxed"
		>
			Explore literary texts with multi-level annotations — from language
			and form to interpretation and context.
		</p>
		<div class="mt-10 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
	</div>
</div>

<!-- Text Library -->
<div class="max-w-5xl mx-auto px-6 pb-16">
	{#if !hasTexts}
		<div
			class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50"
		>
			<div
				class="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center"
			>
				<span class="text-2xl text-gray-400">—</span>
			</div>
			<h3 class="text-lg font-semibold text-gray-900">No texts yet</h3>
			{#if data.user?.role === "admin"}
				<p class="mt-2 text-sm text-gray-500">
					<a
						href="/admin/texts"
						class="text-primary-600 hover:text-primary-700 font-medium"
						>Add a text</a
					> to get started.
				</p>
			{/if}
		</div>
	{:else}
		{#each groupedByType as group}
			<div class="mb-12">
				<!-- Type header -->
				<div class="flex items-center gap-3 mb-6">
					<div class="flex items-center gap-2">
						{#if group.type === "poetry"}
							<IconQuill class="w-5 h-5 text-gray-400" />
						{:else if group.type === "prose"}
							<IconNotebook class="w-5 h-5 text-gray-400" />
						{:else}
							<IconTheatreMasks class="w-5 h-5 text-gray-400" />
						{/if}
						<h2 class="text-xl font-semibold text-gray-900">
							{typeLabel[group.type]}
						</h2>
					</div>
					<div class="flex-1 h-px bg-gray-100"></div>
				</div>

				<!-- Categories within type -->
				{#each group.categories as cat}
					<div class="mb-6 last:mb-0">
						<h3
							class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 pl-1"
						>
							{cat.name}
						</h3>
						<div
							class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
						>
							{#each cat.texts as text}
								<a
									href={`/texts/${text.id}`}
									class="group block p-4 bg-white rounded-xl border border-gray-100 shadow-sm
									       hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5
									       transition-all duration-200"
								>
									<h4
										class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors leading-snug font-serif"
									>
										{text.title}
									</h4>
									<p class="text-sm text-gray-500 mt-1">
										{text.author}{#if text.year}<span
												class="text-gray-300"
											>
												·
											</span>{text.year}{/if}
									</p>
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	{/if}
</div>
