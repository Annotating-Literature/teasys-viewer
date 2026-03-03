<script lang="ts">
	import type { TextSegment } from "$lib/utils/spanSplitter";
	import type { Annotation } from "$lib/types/annotation";
	import { CATEGORY_META } from "$lib/constants";

	let {
		segment,
		annotations,
		activeAnnotationId,
	}: {
		segment: TextSegment;
		annotations: Annotation[];
		activeAnnotationId: string | null;
	} = $props();

	const ids = $derived(segment.annotationIds);

	const isPartOfActiveAnnotation = $derived(
		ids.some((id) => id === activeAnnotationId),
	);

	// Get the primary category color for this segment
	const categoryStyle = $derived.by(() => {
		if (ids.length === 0) return "";
		// Use the first annotation's first level category for coloring
		const primaryId = isPartOfActiveAnnotation
			? activeAnnotationId
			: ids[0];
		const ann = annotations.find((a) => a.id === primaryId);
		if (!ann) return "";
		const meta = CATEGORY_META[ann.levels[0].category];
		return `background-color: ${meta.bg}; border-bottom: 2px solid ${meta.color}40;`;
	});
</script>

{#if ids.length > 1}
	<mark
		class="cursor-pointer transition-all duration-200 rounded-sm px-1 py-0.5
		       {isPartOfActiveAnnotation
			? 'ring-2 ring-primary-300 brightness-95'
			: 'hover:brightness-95'}"
		style={categoryStyle}
		data-segment-ids={JSON.stringify(ids)}
		data-start={segment.start}
		data-end={segment.end}
	>
		{segment.text}<sup class="font-bold text-gray-500 text-[10px] ml-0.5"
			>{ids.length}</sup
		>
	</mark>
{:else if ids.length === 1}
	<mark
		class="cursor-pointer transition-all duration-200 rounded-sm px-1 py-0.5 hover:brightness-95
		       {isPartOfActiveAnnotation
			? 'ring-2 ring-primary-300 brightness-95'
			: ''}"
		style={categoryStyle}
		data-segment-ids={JSON.stringify(ids)}
		data-start={segment.start}
		data-end={segment.end}
	>
		{segment.text}
	</mark>
{:else}
	<span data-start={segment.start} data-end={segment.end}>{segment.text}</span
	>
{/if}
