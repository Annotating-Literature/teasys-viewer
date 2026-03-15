<script lang="ts">
    import type { DramaAct } from "$lib/types/text";
    import type { Annotation } from "$lib/types/annotation";
    import type { TextSegment } from "$lib/utils/spanSplitter";
    import TextSegmentComponent from "./TextSegment.svelte";

    let {
        acts,
        annotations,
        activeAnnotationId,
        getSegmentsForRange,
    }: {
        acts: DramaAct[];
        annotations: Annotation[];
        activeAnnotationId: string | null;
        getSegmentsForRange: (start: number, end: number) => TextSegment[];
    } = $props();
</script>

{#each acts as act}
    <div class="mb-10">
        <h2 class="text-2xl font-semibold mb-6">
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
                <h3
                    class="text-xl font-medium text-gray-800 dark:text-gray-100 mb-4"
                >
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
                        <p class="italic text-gray-500 text-base my-3 pl-10">
                            [{block.text}]
                        </p>
                    {:else}
                        <div class="flex items-baseline mb-1">
                            <div
                                class="w-10 text-right text-[11px] text-gray-500 pr-4 shrink-0 select-none font-sans tabular-nums leading-loose"
                            >
                                {#if (bIdx + 1) % 5 === 0 || bIdx === 0}
                                    {bIdx + 1}
                                {/if}
                            </div>
                            <p>
                                <strong
                                    class="font-bold text-gray-600 dark:text-gray-300 text-m font-sans uppercase tracking-wide"
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
