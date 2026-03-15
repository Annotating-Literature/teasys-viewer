<script lang="ts">
	import type { ParsedText } from "$lib/types/text";
	import type { Annotation } from "$lib/types/annotation";
	import {
		splitIntoSegments,
		type TextSegment,
	} from "$lib/utils/spanSplitter";
	import TextSegmentComponent from "./TextSegment.svelte";
	import PoemRenderer from "./PoemRenderer.svelte";
	import ProseRenderer from "./ProseRenderer.svelte";
	import DramaRenderer from "./DramaRenderer.svelte";
	import { CATEGORY_META } from "$lib/constants";

	let {
		rawText,
		parsedText,
		annotations,
		activeAnnotationId,
		title = "",
	}: {
		rawText: string;
		parsedText: ParsedText | null;
		annotations: Annotation[];
		activeAnnotationId: string | null;
		title?: string;
	} = $props();

	const allSegments = $derived(splitIntoSegments(rawText, annotations));

	// Annotations anchored to the title (negative offsets)
	const titleAnnotations = $derived(
		title ? annotations.filter((a) => a.anchorStart < 0) : [],
	);

	const titleStyle = $derived.by(() => {
		if (titleAnnotations.length === 0) return "";
		const active = titleAnnotations.find(
			(a) => a.id === activeAnnotationId,
		);
		const ann = active || titleAnnotations[0];
		const meta = CATEGORY_META[ann.levels[0]?.category];
		if (!meta) return "";
		return `background-color: ${meta.color}25; border-bottom: 2px solid ${meta.color}60;`;
	});

	function getSegmentsForRange(
		lineStart: number,
		lineEnd: number,
	): TextSegment[] {
		const overlapping = allSegments.filter(
			(seg) => seg.start < lineEnd && seg.end > lineStart,
		);
		return overlapping.map((seg) => {
			const start = Math.max(seg.start, lineStart);
			const end = Math.min(seg.end, lineEnd);
			return { ...seg, text: rawText.substring(start, end), start, end };
		});
	}
</script>

{#if !parsedText}
	<div class="animate-pulse space-y-6">
		<div class="h-8 bg-gray-100 rounded-lg w-2/3"></div>
		<div class="space-y-3">
			<div class="h-5 bg-gray-100 rounded w-full"></div>
			<div class="h-5 bg-gray-100 rounded w-5/6"></div>
			<div class="h-5 bg-gray-100 rounded w-full"></div>
			<div class="h-5 bg-gray-100 rounded w-3/4"></div>
		</div>
	</div>
{:else}
	<div class="text-lg leading-loose text-gray-800">
		{#if title}
			<h2
				class="text-2xl font-semibold text-gray-900 mb-6 font-serif cursor-pointer rounded-sm px-1"
				data-start={-title.length}
				data-end={0}
				data-segment-ids={JSON.stringify(
					titleAnnotations.map((a) => a.id),
				)}
				style={titleStyle}
			>
				{title}
			</h2>
		{/if}
		{#if parsedText.type === "poetry"}
			<PoemRenderer
				poems={parsedText.poems}
				{annotations}
				{activeAnnotationId}
				{getSegmentsForRange}
			/>
		{:else if parsedText.type === "prose"}
			<ProseRenderer
				chapters={parsedText.chapters}
				{annotations}
				{activeAnnotationId}
				{getSegmentsForRange}
			/>
		{:else if parsedText.type === "drama"}
			<DramaRenderer
				acts={parsedText.acts}
				{annotations}
				{activeAnnotationId}
				{getSegmentsForRange}
			/>
		{/if}
	</div>
{/if}
