<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>Authors — TEASys Viewer</title>
    <meta name="description" content="Browse annotated literature by author." />
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-12 md:py-16">
    <div class="mb-14 md:mb-20">
        <Breadcrumbs
            crumbs={[{ label: "Library", href: "/" }, { label: "Authors" }]}
        />
        <h1
            class="text-4xl sm:text-5xl font-bold tracking-tight text[13px]tone-900 font-serif leading-tight"
        >
            Authors
        </h1>
        <div class="w-12 h-[2px] bg-primary-300 rounded-full mt-4 mb-6"></div>
        <p class="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Browse the collection by author. Each page lists their annotated
            texts in this archive.
        </p>
    </div>

    {#if data.authors.length === 0}
        <div
            class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
        >
            <svg
                class="w-12 h-12 mx-auto mb-3 text[13px]tone-400"
                viewBox="0 0 48 48"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <circle cx="24" cy="16" r="8" />
                <path d="M6 42c0-9 8-14 18-14s18 5 18 14" />
            </svg>
            <h3 class="text-lg font-semibold text-gray-900">No authors yet</h3>
            <p class="text-m text-gray-500 mt-1">
                Authors will appear here once texts are added.
            </p>
        </div>
    {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {#each data.authors as author}
                <a
                    href={`/authors/${author.slug}`}
                    class="group block relative p-5 bg-[#faf9f6]/90 backdrop-blur-sm
					       border border-stone-200/60 rounded-xl
					       hover:bg-white hover:border-stone-400
					       hover:shadow-[2px_2px_12px_-4px_rgba(0,0,0,0.05)]
					       hover:-translate-y-0.5
					       transition-all duration-300 ease-out"
                >
                    <div class="flex items-start gap-3.5">
                        {#if author.portraitPath}
                            <img
                                src={author.portraitPath}
                                alt=""
                                class="w-11 h-11 rounded-lg object-cover border border-stone-200/80 shrink-0"
                            />
                        {:else}
                            <div
                                class="w-11 h-11 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 border border-stone-200/50"
                            >
                                <span
                                    class="text-base font-serif text[13px]tone-500"
                                    >{author.name[0]}</span
                                >
                            </div>
                        {/if}
                        <div class="min-w-0">
                            <h2
                                class="text-base font-semibold text[13px]tone-800 group-hover:text-primary-700 transition-colors font-serif leading-snug"
                            >
                                {author.name}
                            </h2>
                            <p class="text[13px] text[13px]tone-500 mt-1">
                                {author.textCount}
                                {author.textCount === 1 ? "text" : "texts"}<span
                                    class="text[13px]tone-400 mx-1">·</span
                                >{author.annotationCount}
                                {author.annotationCount === 1
                                    ? "annotation"
                                    : "annotations"}
                            </p>
                        </div>
                    </div>
                    {#if author.types.length > 0}
                        <div class="flex gap-1.5 mt-3 ml-14.5">
                            {#each author.types as type}
                                <span
                                    class="text-[11px] uppercase tracking-wider font-medium text[13px]tone-500 px-1.5 py-0.5 rounded bg-stone-100"
                                >
                                    {type}
                                </span>
                            {/each}
                        </div>
                    {/if}
                </a>
            {/each}
        </div>
    {/if}
</div>
