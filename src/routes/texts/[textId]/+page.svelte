<script lang="ts">
	import type { PageData } from "./$types";
	import AnnotatedText from "$lib/components/reading/AnnotatedText.svelte";
	import AnnotationEntry from "$lib/components/reading/AnnotationEntry.svelte";
	import AnchorPicker from "$lib/components/reading/AnchorPicker.svelte";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
	import { slugify } from "$lib/utils/slug";

	let { data } = $props();

	let activeAnnotationId = $state<string | null>(null);
	let anchorPickerState = $state<{
		annotations: any[];
		position: { top: number; left: number };
	} | null>(null);

	const activeAnnotation = $derived(
		data.annotations.find((a) => a.id === activeAnnotationId) ?? null,
	);

	const sortedAnnotations = $derived(
		[...data.annotations].sort((a, b) => {
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
			anchorPickerState = null;
		} else {
			const annotations = data.annotations.filter((a) =>
				ids.includes(a.id),
			);
			anchorPickerState = {
				annotations,
				position: {
					top: (event as MouseEvent).clientY + 10,
					left: (event as MouseEvent).clientX,
				},
			};
		}
	}

	function closePanels() {
		activeAnnotationId = null;
		anchorPickerState = null;
	}

	function handlePickerPick(id: string) {
		activeAnnotationId = id;
		anchorPickerState = null;
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
					       text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
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

	<!-- Two-column layout -->
	<div class="flex gap-6 items-start">
		<!-- Left: Text -->
		<div class="flex-1 min-w-0">
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-8 sm:p-10"
				role="button"
				tabindex="0"
				onclick={handleSegmentClick}
				onkeydown={(e) =>
					(e.key === "Enter" || e.key === " ") &&
					handleSegmentClick(e)}
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
					class="text-center py-12 mt-6 border-2 border-dashed border-gray-200 rounded-xl bg-white/50"
				>
					<div
						class="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center"
					>
						<span class="text-xl text-gray-500">—</span>
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
			<div class="w-[380px] shrink-0 sticky top-6">
				<div
					class="bg-white rounded-xl border border-gray-100 shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto"
				>
					{#if activeAnnotation}
						<!-- Active annotation detail -->
						<div
							class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-5 py-3 flex items-center justify-between"
						>
							<span
								class="text[13px] font-semibold text-gray-500 uppercase tracking-wider"
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
									class="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors text-m"
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
						<div class="px-5 py-3 border-b border-gray-100">
							<span
								class="text[13px] font-semibold text-gray-500 uppercase tracking-wider"
							>
								{data.annotations.length} Annotation{data
									.annotations.length !== 1
									? "s"
									: ""}
							</span>
						</div>
						<div class="divide-y divide-gray-50">
							{#each sortedAnnotations as ann}
								<button
									class="w-full text-left px-5 py-3 hover:bg-gray-50/80 transition-colors"
									onclick={() => {
										activeAnnotationId = ann.id;
									}}
								>
									<p
										class="text-m text-gray-800 line-clamp-1"
									>
										“{ann.anchorText}”
									</p>
									<p class="text-[11px] text-gray-500 mt-0.5">
										{ann.authors.join(", ")} · {ann.levels
											.length} level{ann.levels.length !==
										1
											? "s"
											: ""}
									</p>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>

	{#if anchorPickerState}
		<div
			role="button"
			tabindex="0"
			class="fixed inset-0 z-30"
			onclick={closePanels}
			onkeydown={(e) => e.key === "Escape" && closePanels()}
		></div>
		<AnchorPicker
			annotations={anchorPickerState.annotations}
			position={anchorPickerState.position}
			onPick={handlePickerPick}
		/>
	{/if}
</div>
