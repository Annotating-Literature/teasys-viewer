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
                class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6"
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
            <div class="flex items-baseline mb-4">
                <div
                    class="w-10 text-right text-[11px] text-gray-500 pr-4 shrink-0 select-none font-sans tabular-nums"
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
