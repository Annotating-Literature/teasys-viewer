<script lang="ts">
	import type { PageData } from "./$types";
	import IconQuill from "$lib/components/icons/IconQuill.svelte";
	import IconNotebook from "$lib/components/icons/IconNotebook.svelte";
	import IconTheatreMasks from "$lib/components/icons/IconTheatreMasks.svelte";
	import { slugify } from "$lib/utils/slug";

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

<div class="max-w-5xl mx-auto px-6 py-12 md:py-16">
	<!-- Header -->
	<div class="mb-14 md:mb-20 relative">
		<div
			class="absolute -top-8 -left-12 w-48 h-48 bg-primary-100/30 rounded-full blur-3xl pointer-events-none"
		></div>
		<h1
			class="relative text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 font-serif leading-tight mb-2"
		>
			Annotated Literature
		</h1>
		<div class="w-16 h-[2px] bg-primary-300 rounded-full mt-4 mb-6"></div>
		<p class="text-lg text-gray-600 max-w-2xl leading-relaxed">
			Explore literary texts with multi-level annotations — from language
			and form to interpretation and context.
		</p>
	</div>

	<!-- Text Library -->
	{#if !hasTexts}
		<div
			class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
		>
			<svg
				class="w-14 h-14 mx-auto mb-4 text-stone-400"
				viewBox="0 0 48 48"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M6 8h14c2 0 4 2 4 4v24c0-2-2-4-4-4H6V8z" />
				<path d="M42 8H28c-2 0-4 2-4 4v24c0-2 2-4 4-4h14V8z" />
			</svg>
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
		<div class="space-y-16">
			{#each groupedByType as group}
				<div>
					<!-- Type header -->
					<div class="flex items-center gap-3 mb-8">
						<div class="flex items-center gap-2">
							{#if group.type === "poetry"}
								<IconQuill class="w-5 h-5 text-gray-500" />
							{:else if group.type === "prose"}
								<IconNotebook class="w-5 h-5 text-gray-500" />
							{:else}
								<IconTheatreMasks
									class="w-5 h-5 text-gray-500"
								/>
							{/if}
							<h2
								class="text-2xl font-serif text-stone-800 tracking-wide"
							>
								{typeLabel[group.type]}
							</h2>
						</div>
						<div class="flex-1 h-px bg-gray-200"></div>
					</div>

					<!-- Categories within type -->
					<div class="space-y-10">
						{#each group.categories as cat}
							<div>
								<div class="flex items-center gap-4 mb-5 pl-1">
									<h3
										class="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]"
									>
										{cat.name}
									</h3>
									<div
										class="flex-1 border-t border-dashed border-gray-200"
									></div>
								</div>
								<div
									class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
								>
									{#each cat.texts as text}
										<div
											class="group block relative p-6 bg-[#faf9f6]/90 backdrop-blur-sm
									       border border-stone-200/60 rounded-xl
									       hover:bg-white hover:border-stone-400
									       hover:shadow-[2px_2px_12px_-4px_rgba(0,0,0,0.05)]
									       hover:-translate-y-0.5
									       transition-all duration-300 ease-out overflow-hidden"
										>
											<h4
												class="text-base font-semibold text-stone-800 group-hover:text-primary-700 transition-colors leading-snug font-serif"
											>
												<a
													href={`/texts/${text.id}`}
													class="after:absolute after:inset-0"
												>
													{text.title}
												</a>
											</h4>
											<p
												class="text-sm text-stone-500 mt-2 relative z-10"
											>
												<a
													href={`/authors/${slugify(text.author)}`}
													class="hover:text-primary-600 transition-colors"
													>{text.author}</a
												>{#if text.year}<span
														class="text-gray-500 mx-1.5"
													>
														·
													</span>{text.year}{/if}
											</p>
										</div>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
