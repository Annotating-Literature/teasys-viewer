<script lang="ts">
	import type { ParsedText } from "$lib/types/text";
	import type { Annotation } from "$lib/types/annotation";
	import {
		splitIntoSegments,
		type TextSegment,
	} from "$lib/utils/spanSplitter";
	import TextSegmentComponent from "./TextSegment.svelte";
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
		return `background-color: ${meta.bg}; border-bottom: 2px solid ${meta.color}40;`;
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
			{#each parsedText.poems as poem}
				<div class="mb-10">
					{#if poem.title !== "Untitled"}
						<h2 class="text-2xl font-semibold text-gray-900 mb-6">
							{#if poem.titleStart !== undefined && poem.titleEnd !== undefined}
								{#each getSegmentsForRange(poem.titleStart, poem.titleEnd) as segment}
									<TextSegmentComponent
										{segment}
										{annotations}
										{activeAnnotationId}
									/>
								{/each}
							{:else}
								{poem.title}
							{/if}
						</h2>
					{/if}
					{#each poem.stanzas as stanza, i}
						<div class:mt-6={i > 0}>
							{#each stanza as line}
								{@const lineNum = line.globalIndex + 1}
								<div class="flex">
									<div
										class="w-10 text-right text-s text-gray-500 pr-4 shrink-0 pt-[0.35em] select-none font-sans tabular-nums leading-loose"
									>
										{#if lineNum % 5 === 0 || lineNum === 1}
											{lineNum}
										{/if}
									</div>
									<div class="leading-loose">
										{#each getSegmentsForRange(line.start, line.end) as segment}
											<TextSegmentComponent
												{segment}
												{annotations}
												{activeAnnotationId}
											/>
										{/each}
									</div>
								</div>
							{/each}
						</div>
					{/each}
				</div>
			{/each}
		{:else if parsedText.type === "prose"}
			{#each parsedText.chapters as chapter}
				<div class="mb-10">
					{#if chapter.title !== "Untitled"}
						<h2 class="text-2xl font-semibold text-gray-900 mb-6">
							{#if chapter.titleStart !== undefined && chapter.titleEnd !== undefined}
								{#each getSegmentsForRange(chapter.titleStart, chapter.titleEnd) as segment}
									<TextSegmentComponent
										{segment}
										{annotations}
										{activeAnnotationId}
									/>
								{/each}
							{:else}
								{chapter.title}
							{/if}
						</h2>
					{/if}
					{#each chapter.paragraphs as paragraph, pIdx}
						<div class="flex mb-4">
							<div
								class="w-10 text-right text-s text-gray-500 pr-4 shrink-0 pt-[0.35em] select-none font-sans tabular-nums"
							>
								{pIdx + 1}
							</div>
							<p class="text-justify flex-1">
								{#each getSegmentsForRange(paragraph.start, paragraph.end) as segment}
									<TextSegmentComponent
										{segment}
										{annotations}
										{activeAnnotationId}
									/>
								{/each}
							</p>
						</div>
					{/each}
				</div>
			{/each}
		{:else if parsedText.type === "drama"}
			{#each parsedText.acts as act}
				<div class="mb-10">
					<h2 class="text-2xl font-semibold text-gray-900 mb-6">
						{#if act.titleStart !== undefined && act.titleEnd !== undefined}
							{#each getSegmentsForRange(act.titleStart, act.titleEnd) as segment}
								<TextSegmentComponent
									{segment}
									{annotations}
									{activeAnnotationId}
								/>
							{/each}
						{:else}
							{act.title}
						{/if}
					</h2>
					{#each act.scenes as scene}
						<div class="mb-6">
							<h3 class="text-xl font-medium text-gray-800 mb-4">
								{#if scene.titleStart !== undefined && scene.titleEnd !== undefined}
									{#each getSegmentsForRange(scene.titleStart, scene.titleEnd) as segment}
										<TextSegmentComponent
											{segment}
											{annotations}
											{activeAnnotationId}
										/>
									{/each}
								{:else}
									{scene.title}
								{/if}
							</h3>
							{#each scene.blocks as block, bIdx}
								{#if block.type === "stage"}
									<p
										class="italic text-gray-500 text-base my-3 pl-10"
									>
										[{block.text}]
									</p>
								{:else}
									<div class="flex mb-1">
										<div
											class="w-10 text-right text-s text-gray-500 pr-4 shrink-0 pt-[0.35em] select-none font-sans tabular-nums leading-loose"
										>
											{#if (bIdx + 1) % 5 === 0 || bIdx === 0}
												{bIdx + 1}
											{/if}
										</div>
										<p>
											<strong
												class="font-bold text-gray-600 text-m font-sans uppercase tracking-wide"
												>{block.speaker}:</strong
											>
											<span class="ml-2">
												{#each getSegmentsForRange(block.start, block.end) as segment}
													<TextSegmentComponent
														{segment}
														{annotations}
														{activeAnnotationId}
													/>
												{/each}
											</span>
										</p>
									</div>
								{/if}
							{/each}
						</div>
					{/each}
				</div>
			{/each}
		{/if}
	</div>
{/if}
