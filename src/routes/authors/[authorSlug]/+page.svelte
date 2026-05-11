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
    <!-- Breadcrumb -->
    <nav class="text-sm text-gray-400 mb-10">
        <a href="/authors" class="hover:text-primary-600 transition-colors"
            >Authors</a
        >
        <span class="mx-1.5">›</span>
        <span class="text-gray-600 dark:text-gray-400">{data.author}</span>
    </nav>

    <!-- Hero -->
    <div class="flex items-start gap-8 mb-12">
        {#if data.portraitPath}
            <div class="shrink-0">
                <div
                    class="group/portrait relative w-40 h-40 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-700 shadow-sm"
                >
                    <img
                        src={data.portraitPath}
                        alt="Portrait of {data.author}"
                        class="w-full h-full object-cover object-top"
                    />
                    {#if data.photoCredit}
                        <div
                            class="absolute inset-x-0 bottom-0 px-2.5 py-2 bg-black/50 backdrop-blur-sm opacity-0 group-hover/portrait:opacity-100 transition-opacity duration-200"
                        >
                            {#if data.photoCreditUrl}
                                <a
                                    href={data.photoCreditUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-[10px] text-white/80 hover:text-white leading-tight block"
                                >
                                    © {data.photoCredit}
                                </a>
                            {:else}
                                <p
                                    class="text-[10px] text-white/80 leading-tight"
                                >
                                    © {data.photoCredit}
                                </p>
                            {/if}
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <div class="pt-1">
            <h1
                class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight"
            >
                {data.author}
            </h1>
            {#if data.birthYear || data.deathYear}
                <p class="text-base text-gray-400 font-serif mt-2">
                    {data.birthYear ?? "?"}–{data.deathYear ?? ""}
                </p>
            {/if}
            {#if data.user}
                <a
                    href={`/admin/authors/${data.slug}`}
                    class="inline-flex items-center gap-1.5 mt-4 text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
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

    <!-- Bio -->
    {#if renderedBio}
        <div
            class="prose prose-sm max-w-2xl text-gray-600 dark:text-gray-400 dark:prose-invert leading-relaxed mb-12"
        >
            {@html renderedBio}
        </div>
    {/if}

    <!-- Texts -->
    {#if data.texts.length === 0}
        <div
            class="text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-900/20"
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
                    class="group block relative p-6 bg-surface-card backdrop-blur-sm
                           border border-gray-200/60 rounded-xl
                           hover:bg-surface-elevated hover:border-gray-400
                           hover:shadow-sm hover:-translate-y-0.5
                           transition-all duration-200 ease-out overflow-hidden"
                >
                    <h4
                        class="text-base font-semibold text-gray-800 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug font-serif"
                    >
                        {text.title}
                    </h4>
                    <div class="flex items-center gap-2 mt-2">
                        {#if text.year}
                            <span class="text-sm text-gray-400"
                                >{text.year}</span
                            >
                            <span class="text-gray-300 dark:text-gray-600"
                                >·</span
                            >
                        {/if}
                        <span
                            class="text-[11px] uppercase tracking-wider font-medium text-stone-400 dark:text-stone-500 px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800"
                        >
                            {typeLabel[text.type] ?? text.type}
                        </span>
                        {#if text.annotationCount > 0}
                            <span class="text-gray-300 dark:text-gray-600"
                                >·</span
                            >
                            <span class="text-[12px] text-gray-400">
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
