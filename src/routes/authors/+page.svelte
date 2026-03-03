<script lang="ts">
    import type { PageData } from "./$types";

    let { data } = $props();
</script>

<svelte:head>
    <title>Authors — TEASys Viewer</title>
    <meta name="description" content="Browse annotated literature by author." />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 md:py-16">
    <div class="mb-14 md:mb-20">
        <h1
            class="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 font-serif leading-tight"
        >
            Authors
        </h1>
        <p class="mt-6 text-lg text-gray-600 max-w-2xl leading-relaxed">
            Browse the collection by author. Each page lists their annotated
            texts in this archive.
        </p>
    </div>

    {#if data.authors.length === 0}
        <div
            class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
        >
            <h3 class="text-lg font-semibold text-gray-900">No authors yet</h3>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each data.authors as author}
                <a
                    href={`/authors/${author.slug}`}
                    class="group block relative p-6 bg-[#faf9f6]/90 backdrop-blur-sm
					       border border-stone-200/60 rounded-xl
					       hover:bg-white hover:border-stone-300
					       hover:shadow-[2px_2px_12px_-4px_rgba(0,0,0,0.05)]
					       hover:-translate-y-0.5
					       transition-all duration-300 ease-out"
                >
                    <h2
                        class="text-lg font-semibold text-stone-800 group-hover:text-primary-700 transition-colors font-serif"
                    >
                        {author.name}
                    </h2>
                    <p class="text-sm text-stone-500 mt-2">
                        {author.textCount}
                        {author.textCount === 1 ? "text" : "texts"}<span
                            class="text-stone-300 mx-1.5">·</span
                        >{author.annotationCount}
                        {author.annotationCount === 1
                            ? "annotation"
                            : "annotations"}
                    </p>
                    <div class="flex gap-1.5 mt-3">
                        {#each author.types as type}
                            <span
                                class="text-[10px] uppercase tracking-wider font-medium text-stone-400 px-1.5 py-0.5 rounded bg-stone-100"
                            >
                                {type}
                            </span>
                        {/each}
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
