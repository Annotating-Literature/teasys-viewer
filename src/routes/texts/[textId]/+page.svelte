<script lang="ts">
	import type { PageData } from "./$types";
	import AnnotatedText from "$lib/components/reading/AnnotatedText.svelte";
	import AnnotationEntry from "$lib/components/reading/AnnotationEntry.svelte";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
	import { slugify } from "$lib/utils/slug";
	import { CATEGORY_META } from "$lib/constants";

	let { data } = $props();

	let activeAnnotationId = $state<string | null>(null);
	let selectedCategory = $state<string>("All");

	const activeAnnotation = $derived(
		data.annotations.find((a) => a.id === activeAnnotationId) ?? null,
	);

	// Get unique categories for the filter
	const availableCategories = $derived(
		[
			"All",
			...new Set(
				data.annotations.flatMap((a) =>
					a.levels.map((l) => l.category),
				),
			),
		].sort(),
	);

	function isEnclosed(a: (typeof data.annotations)[0]) {
		return data.annotations.some(
			(parent) =>
				parent.id !== a.id &&
				parent.anchorStart <= a.anchorStart &&
				parent.anchorEnd >= a.anchorEnd &&
				(parent.anchorStart < a.anchorStart ||
					parent.anchorEnd > a.anchorEnd),
		);
	}

	const sortedAnnotations = $derived(
		[...data.annotations]
			.filter((a) => {
				const matchesCategory =
					selectedCategory === "All" ||
					a.levels.some((l) => l.category === selectedCategory);

				// Hide strictly enclosed annotations from the main list
				// to declutter, unless a specific category filter is active and the parent might not be in that category
				const shouldHide =
					selectedCategory === "All" ? isEnclosed(a) : false;

				return matchesCategory && !shouldHide;
			})
			.sort((a, b) => {
				if (a.anchorStart !== b.anchorStart) {
					return a.anchorStart - b.anchorStart;
				}
				return b.anchorEnd - a.anchorEnd;
			}),
	);

	function handleSegmentClick(event: MouseEvent | KeyboardEvent) {
		const target = event.target as HTMLElement;
		const segmentNode = target.closest("[data-segment-ids]");
		if (!segmentNode) return;

		const ids = JSON.parse(
			segmentNode.getAttribute("data-segment-ids") || "[]",
		) as string[];
		if (ids.length === 0) return;

		if (ids.length === 1) {
			activeAnnotationId = ids[0];
		} else {
			// Click-to-cycle UX for overlapping annotations
			if (activeAnnotationId && ids.includes(activeAnnotationId)) {
				const currentIndex = ids.indexOf(activeAnnotationId);
				activeAnnotationId = ids[(currentIndex + 1) % ids.length];
			} else {
				activeAnnotationId = ids[0];
			}
		}
	}

	function closePanels() {
		activeAnnotationId = null;
	}
</script>

<svelte:head>
	<title>{data.text.metadata.title} — TEASys Viewer</title>
	<meta
		name="description"
		content="{data.text.metadata.title} by {data.text.metadata
			.author} — annotated reading view"
	/>
</svelte:head>

<div class="max-w-7xl mx-auto px-6 py-10">
	<!-- Header -->
	<div class="mb-8">
		<Breadcrumbs
			crumbs={[
				{ label: "Library", href: "/" },
				{
					label: data.text.metadata.author,
					href: `/authors/${slugify(data.text.metadata.author)}`,
				},
				{ label: data.text.metadata.title },
			]}
		/>
		<div class="flex items-start justify-between">
			<div>
				<h1
					class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight"
				>
					{data.text.metadata.title}
				</h1>
				<p class="mt-2 text-lg text-gray-500">
					<a
						href={`/authors/${slugify(data.text.metadata.author)}`}
						class="hover:text-primary-600 transition-colors"
						>{data.text.metadata.author}</a
					>{#if data.text.metadata.year}<span
							class="text-gray-500 mx-2">·</span
						><span class="text-gray-500"
							>{data.text.metadata.year}</span
						>{/if}
				</p>
			</div>
			{#if data.user}
				<a
					href={`/texts/${data.text.metadata.id}/annotate`}
					class="shrink-0 ml-4 inline-flex items-center gap-2 px-4 py-2 text-m font-medium
					       text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-800 rounded-lg transition-colors"
				>
					<svg
						class="w-3.5 h-3.5"
						viewBox="0 0 14 14"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path d="M10 2l2 2-7 7H3v-2l7-7z" /></svg
					>
					Annotate
				</a>
			{/if}
		</div>
	</div>

	<!-- Two-column layout or Table of Contents -->
	{#if data.text.metadata.type === "collection"}
		<div class="max-w-2xl mt-12">
			<h2
				class="text-xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-3"
			>
				Table of Contents
				<div class="flex-1 h-px bg-gray-200"></div>
			</h2>
			{#if data.children.length === 0}
				<div
					class="text-center py-12 border-2 text-gray-400 border-dashed border-gray-200 rounded-xl bg-surface-card/50"
				>
					This collection is empty.
				</div>
			{:else}
				<div class="space-y-4">
					{#each data.children as child, i}
						<a
							href={`/texts/${child.id}`}
							class="block bg-surface-card hover:bg-surface-elevated rounded-xl border border-gray-100 shadow-sm p-5 transition-colors group"
						>
							<div class="flex items-center gap-4">
								<div
									class="w-10 h-10 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center font-serif text-gray-400 font-semibold border border-gray-100/50"
								>
									{child.order || i + 1}
								</div>
								<div class="flex-1">
									<h3
										class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors"
									>
										{child.title}
									</h3>
									{#if child.author !== data.text.metadata.author}
										<p class="text-sm text-gray-500 mt-1">
											{child.author}
										</p>
									{/if}
								</div>
								<div
									class="text-gray-300 group-hover:text-primary-500 transition-colors"
								>
									<svg
										class="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M9 5l7 7-7 7"
										/></svg
									>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	{:else}
		<div class="flex gap-6 items-start">
			<!-- Left: Text -->
			<div class="flex-1 min-w-0">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8 sm:p-10"
					onclick={handleSegmentClick}
				>
					<AnnotatedText
						rawText={data.text.rawText}
						parsedText={data.parsedText}
						annotations={data.annotations}
						title={data.text.metadata.title}
						{activeAnnotationId}
					/>
				</div>

				{#if data.annotations.length === 0}
					<div
						class="text-center py-12 mt-6 border-2 border-dashed border-gray-200 rounded-xl bg-surface-card/50"
					>
						<div
							class="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-elevated flex items-center justify-center border border-gray-200/60"
						>
							<svg
								class="w-6 h-6 text-gray-400"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path
									d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 010-5H20"
								/>
							</svg>
						</div>
						<h3 class="text-base font-semibold text-gray-900">
							No annotations yet
						</h3>
						{#if data.user}
							<p class="mt-1 text-m text-gray-500">
								<a
									href={`/texts/${data.text.metadata.id}/annotate`}
									class="text-primary-600 hover:text-primary-700 font-medium"
									>Create one</a
								> to get started.
							</p>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Right: Annotation panel (sticky, scrollable) -->
			{#if data.annotations.length > 0}
				<div
					class="fixed inset-x-0 mx-auto max-w-lg md:max-w-none bottom-0 z-40 md:inset-auto md:w-[380px] md:shrink-0 md:sticky md:top-24 pointer-events-none md:pointer-events-auto"
				>
					<div
						class="bg-surface-card rounded-t-2xl md:rounded-xl border border-gray-200/50 shadow-2xl md:shadow-sm max-h-[60vh] md:max-h-[calc(100vh-6rem)] flex flex-col overflow-y-auto pointer-events-auto transition-transform duration-300 ease-out {!activeAnnotation
							? 'translate-y-full md:translate-y-0'
							: 'translate-y-0'}"
					>
						{#if activeAnnotation}
							<!-- Active annotation detail -->
							<div
								class="sticky top-0 bg-surface-card/90 backdrop-blur-sm border-b border-gray-200/50 px-5 py-3 flex items-center justify-between z-10"
							>
								<span
									class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
									>Annotation</span
								>
								<div class="flex items-center gap-2">
									{#if data.user}
										<a
											href={`/texts/${data.text.metadata.id}/annotate?annotationId=${activeAnnotation.id}`}
											class="text[13px] font-medium text-primary-600 hover:text-primary-700 px-2 py-1 rounded-md bg-primary-50 hover:bg-primary-100 transition-colors"
										>
											Edit
										</a>
									{/if}
									<button
										onclick={closePanels}
										class="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100/50 transition-colors text-xl"
									>
										&times;
									</button>
								</div>
							</div>
							<div class="p-5">
								<AnnotationEntry
									annotation={activeAnnotation}
									allAnnotations={data.annotations}
									onCrossRefClick={(id) => {
										activeAnnotationId = id;
									}}
								/>
							</div>
						{:else}
							<!-- Annotation list -->
							<div
								class="px-5 py-3 border-b border-gray-200/50 flex items-center justify-between"
							>
								<span
									class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
								>
									{sortedAnnotations.length} Annotation{sortedAnnotations.length !==
									1
										? "s"
										: ""}
								</span>
								{#if availableCategories.length > 2}
									<select
										class="text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-400 transition-shadow"
										bind:value={selectedCategory}
									>
										{#each availableCategories as cat}
											<option value={cat}
												>{cat === "All"
													? "All"
													: CATEGORY_META[
															cat as keyof typeof CATEGORY_META
														]?.label || cat}</option
											>
										{/each}
									</select>
								{/if}
							</div>
							<div class="divide-y divide-gray-50">
								{#each sortedAnnotations as ann}
									<button
										class="w-full text-left px-5 py-3 hover:bg-gray-50/80 focus:outline-none focus:bg-primary-50 focus:ring-2 focus:ring-inset focus:ring-primary-400 transition-colors"
										onclick={() => {
											activeAnnotationId = ann.id;
										}}
									>
										<div
											class="flex items-center gap-2 mb-1.5"
										>
											<div
												class="w-1.5 h-1.5 rounded-full"
												style="background-color: {CATEGORY_META[
													ann.levels[0].category
												]?.color ||
													'var(--color-primary-400)'};"
											></div>
											<p
												class="text-[11px] font-medium text-gray-500 uppercase tracking-wide"
											>
												{CATEGORY_META[
													ann.levels[0].category
												]?.label ||
													ann.levels[0].category}
											</p>
										</div>
										<p
											class="text-[13px] text-gray-800 line-clamp-2 leading-relaxed font-serif"
										>
											“{ann.anchorText}”
										</p>
										<p
											class="text-[11px] text-gray-400 mt-1.5"
										>
											{ann.levels.length} level{ann.levels
												.length !== 1
												? "s"
												: ""}
										</p>
									</button>
								{/each}
								{#if sortedAnnotations.length === 0}{/if}
							</div>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
