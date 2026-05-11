<script lang="ts">
    import type { ProseChapter } from "$lib/types/text";
    import type { Annotation } from "$lib/types/annotation";
    import type { TextSegment } from "$lib/utils/spanSplitter";
    import TextSegmentComponent from "./TextSegment.svelte";

    let {
        chapters,
        annotations,
        activeAnnotationId,
        getSegmentsForRange,
    }: {
        chapters: ProseChapter[];
        annotations: Annotation[];
        activeAnnotationId: string | null;
        getSegmentsForRange: (start: number, end: number) => TextSegment[];
    } = $props();
</script>

{#each chapters as chapter}
    <div class="mb-10">
        {#if chapter.title !== "Untitled"}
            <h2
                class="text-2xl font-semibold text-gray-900 mb-6"
            >
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
            <div class="flex items-baseline mb-6">
                <div
                    class="w-8 md:w-12 text-right text-[11px] text-gray-400 pr-3 md:pr-5 shrink-0 select-none font-sans tabular-nums pt-1.5 md:pt-2"
                >
                    {pIdx + 1}
                </div>
                <p class="text-left flex-1 text-gray-800">
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
