<script lang="ts">
	import type { PageData } from "./$types";
	import AnnotatedText from "$lib/components/reading/AnnotatedText.svelte";
	import AnnotationEntry from "$lib/components/reading/AnnotationEntry.svelte";
	import AnnotationPickerModal from "$lib/components/reading/AnnotationPickerModal.svelte";
	import TextHeader from "$lib/components/reading/TextHeader.svelte";
	import CollectionToc from "$lib/components/reading/CollectionToc.svelte";
	import { CATEGORY_META } from "$lib/constants";
	import Seo from "$lib/components/Seo.svelte";
	import { SITE } from "$lib/config/site";

	let { data } = $props();

	let activeAnnotationId = $state<string | null>(null);
	let selectedCategory = $state<string>("All");
	let activeAnnotationLevelId = $state<number | null>(null); // For collapsing/expanding levels in the right pane

	// Picker Modal State
	let pickerAnnotations = $state<any[]>([]);
	let pickerPosition = $state<{ x: number; y: number } | null>(null);
	let pickerTitle = $state<string>("");

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

		// Show picker modal
		const rect = segmentNode.getBoundingClientRect();
		
		// Modal is 256px wide (w-64). Prevent flowing off screen.
		const modalPxWidth = 256;
		const maxLeft = window.innerWidth - modalPxWidth - 16;
		const xPos = Math.min(rect.right + 12, maxLeft);

		pickerPosition = {
			x: xPos,
			y: rect.top, // Align top with the segment, position to the right
		};
		pickerAnnotations = data.annotations.filter((a) => ids.includes(a.id));
		pickerTitle = pickerAnnotations[0]?.anchorText || 'Annotation Picker';
	}

	function closePicker() {
		pickerPosition = null;
		pickerAnnotations = [];
		pickerTitle = "";
	}

	function handlePickerSelect(id: string, levelNum: number) {
		activeAnnotationId = id;
		activeAnnotationLevelId = levelNum;
		closePicker();
	}

	function closePanels() {
		activeAnnotationId = null;
		activeAnnotationLevelId = null;
	}
</script>

<Seo
	title={data.text.metadata.title}
	description="{data.text.metadata.title} by {data.text.metadata.author}{data.text.metadata.year ? ` (${data.text.metadata.year})` : ''} — annotated reading view"
	canonical="/texts/{data.text.metadata.id}"
	type="book"
	jsonLd={{
		'@context': 'https://schema.org',
		'@type': 'Book',
		name: data.text.metadata.title,
		author: { '@type': 'Person', name: data.text.metadata.author },
		...(data.text.metadata.year ? { datePublished: String(data.text.metadata.year) } : {}),
		genre: data.text.metadata.type,
		url: SITE.siteUrl ? `${SITE.siteUrl}/texts/${data.text.metadata.id}` : undefined,
		isPartOf: SITE.siteUrl ? { '@type': 'WebSite', name: SITE.name, url: SITE.siteUrl } : undefined,
	}}
/>

<div class="max-w-7xl mx-auto px-6 py-10 relative">
	{#if pickerPosition && pickerAnnotations.length > 0}
		<AnnotationPickerModal
			annotations={pickerAnnotations}
			position={pickerPosition}
			title={pickerTitle}
			onSelect={handlePickerSelect}
			onClose={closePicker}
		/>
	{/if}

	<TextHeader textMetadata={data.text.metadata} user={data.user} />

	<!-- Two-column layout or Table of Contents -->
	{#if data.text.metadata.type === "collection"}
		<CollectionToc children={data.children} textMetadata={data.text.metadata} />
	{:else}
		<div class="flex gap-6 items-start">
			<!-- Left: Text -->
			<div class="flex-1 min-w-0 flex justify-center">
				<div class="w-full max-w-[800px]">
					<div
						class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8 sm:p-10 md:p-12 lg:p-14"
						onclick={handleSegmentClick}
						role="presentation"
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
									expandedLevel={activeAnnotationLevelId}
									onCrossRefClick={(id: string) => {
										activeAnnotationId = id;
										activeAnnotationLevelId = null;
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
											activeAnnotationLevelId = null;
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
