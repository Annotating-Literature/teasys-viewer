<script lang="ts">
    import type { PageData } from "./$types";
    import { marked } from "marked";

    let { data } = $props();

    const typeLabel: Record<string, string> = {
        poetry: "Poetry",
        prose: "Prose",
        drama: "Drama",
    };

    const renderedBio = $derived(data.bio ? (marked(data.bio) as string) : "");
</script>

<svelte:head>
    <title>{data.author} — TEASys Viewer</title>
    <meta
        name="description"
        content={`Annotated texts by ${data.author} in the TEASys Viewer.`}
    />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 md:py-16">
    <div class="mb-14 md:mb-20">
        <nav class="text-m text-stone-500 mb-4">
            <a href="/authors" class="hover:text-primary-600 transition-colors">
                Authors
            </a>
            <span class="mx-1.5">›</span>
            <span class="text-stone-600">{data.author}</span>
        </nav>

        <div class="flex items-start gap-8">
            {#if data.portraitPath}
                <img
                    src={data.portraitPath}
                    alt="Portrait of {data.author}"
                    class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-stone-200 shadow-sm shrink-0"
                />
            {/if}
            <div>
                <h1
                    class="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 font-serif leading-tight"
                >
                    {data.author}
                </h1>
                <p class="mt-4 text-lg text-gray-500">
                    {data.texts.length}
                    {data.texts.length === 1 ? "text" : "texts"} in the archive
                </p>
                {#if data.user}
                    <a
                        href={`/admin/authors/${data.slug}`}
                        class="inline-flex items-center gap-1.5 mt-3 text-s font-medium text-primary-600 hover:text-primary-700 transition-colors"
                    >
                        <svg
                            class="w-3 h-3"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            ><path d="M10 2l2 2-7 7H3v-2l7-7z" /></svg
                        >
                        Edit profile
                    </a>
                {/if}
            </div>
        </div>
    </div>

    <!-- Bio -->
    {#if renderedBio}
        <div
            class="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-12 pb-8 border-b border-stone-200"
        >
            {@html renderedBio}
        </div>
    {/if}

    <!-- Texts -->
    {#if data.texts.length === 0}
        <div
            class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
        >
            <h3 class="text-lg font-semibold text-gray-900">
                No texts by this author yet
            </h3>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each data.texts as text}
                <a
                    href={`/texts/${text.id}`}
                    class="group block relative p-6 bg-[#faf9f6]/90 backdrop-blur-sm
					       border border-stone-200/60 rounded-xl
					       hover:bg-white hover:border-stone-400
					       hover:shadow-[2px_2px_12px_-4px_rgba(0,0,0,0.05)]
					       hover:-translate-y-0.5
					       transition-all duration-300 ease-out overflow-hidden"
                >
                    <h4
                        class="text-base font-semibold text-stone-800 group-hover:text-primary-700 transition-colors leading-snug font-serif"
                    >
                        {text.title}
                    </h4>
                    <div class="flex items-center gap-2 mt-2">
                        {#if text.year}
                            <span class="text-m text-stone-500"
                                >{text.year}</span
                            >
                            <span class="text-stone-400">·</span>
                        {/if}
                        <span
                            class="text-[11px] uppercase tracking-wider font-medium text-stone-500 px-1.5 py-0.5 rounded bg-stone-100"
                        >
                            {typeLabel[text.type] ?? text.type}
                        </span>
                        {#if text.annotationCount > 0}
                            <span class="text-stone-400">·</span>
                            <span class="text-s text-stone-500">
                                {text.annotationCount}
                                {text.annotationCount === 1
                                    ? "annotation"
                                    : "annotations"}
                            </span>
                        {/if}
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
