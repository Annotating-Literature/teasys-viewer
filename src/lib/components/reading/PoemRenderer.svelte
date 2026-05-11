<script lang="ts">
    import type { Poem } from "$lib/types/text";
    import type { Annotation } from "$lib/types/annotation";
    import type { TextSegment } from "$lib/utils/spanSplitter";
    import TextSegmentComponent from "./TextSegment.svelte";

    let {
        poems,
        annotations,
        activeAnnotationId,
        getSegmentsForRange,
    }: {
        poems: Poem[];
        annotations: Annotation[];
        activeAnnotationId: string | null;
        getSegmentsForRange: (start: number, end: number) => TextSegment[];
    } = $props();
</script>

{#each poems as poem}
    <div class="mb-10">
        {#if poem.title !== "Untitled"}
            <h2
                class="text-2xl font-semibold text-gray-900 mb-6"
            >
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
                    <div class="flex items-baseline">
                        <div
                            class="w-10 text-right text-[12px] text-gray-400 pr-4 shrink-0 select-none font-serif tabular-nums leading-loose"
                        >
                            {#if (!line.isDropLine && lineNum % 5 === 0) || (!line.isDropLine && lineNum === 1)}
                                {lineNum}
                            {/if}
                        </div>
                        <div
                            class="leading-loose"
                            style={line.indentCount
                                ? `padding-left: ${line.indentCount * 0.5}rem;`
                                : ""}
                        >
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
