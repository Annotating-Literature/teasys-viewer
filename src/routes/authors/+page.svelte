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
    <div class="mb-10">
        <Breadcrumbs
            crumbs={[{ label: "Library", href: "/" }, { label: "Authors" }]}
        />
        <h1
            class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight mt-4"
        >
            Authors
        </h1>
        <p class="text-lg text-gray-500 mt-3 max-w-2xl leading-relaxed">
            Browse the collection by author.
        </p>
    </div>

    {#if data.authors.length === 0}
        <div
            class="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50"
        >
            <svg
                class="w-12 h-12 mx-auto mb-3 text-stone-400"
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {#each data.authors as author}
                <a
                    href={`/authors/${author.slug}`}
                    class="group flex items-center gap-4 p-4 bg-surface-card
                           border border-gray-200/60 rounded-xl
                           hover:bg-surface-elevated hover:border-gray-300
                           hover:shadow-sm hover:-translate-y-0.5
                           transition-all duration-200 ease-out"
                >
                    <!-- Avatar / Portrait -->
                    {#if author.portraitPath}
                        <div
                            class="w-14 h-14 rounded-xl overflow-hidden border border-stone-200/80 shrink-0"
                        >
                            <img
                                src={author.portraitPath}
                                alt=""
                                class="w-full h-full object-cover object-top"
                            />
                        </div>
                    {:else}
                        <div
                            class="w-14 h-14 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center shrink-0 border border-stone-200/50 dark:border-stone-700"
                        >
                            <span class="text-xl font-serif text-stone-400"
                                >{author.name[0]}</span
                            >
                        </div>
                    {/if}

                    <!-- Name + meta -->
                    <div class="min-w-0">
                        <h2
                            class="text-base font-bold text-gray-800 group-hover:text-primary-700 transition-colors font-serif leading-snug"
                        >
                            {author.name}
                        </h2>
                        {#if author.birthYear || author.deathYear}
                            <p
                                class="text-[12px] text-gray-400 font-serif mt-0.5"
                            >
                                {author.birthYear ?? "?"}–{author.deathYear ??
                                    ""}
                            </p>
                        {/if}
                        <p
                            class="text-[12px] text-gray-500 mt-1 uppercase tracking-wider font-medium"
                        >
                            {author.textCount}
                            {author.textCount === 1 ? "text" : "texts"}
                            {#each author.types as type}
                                <span
                                    class="ml-1.5 text-[10px] normal-case tracking-normal font-normal text-stone-400 dark:text-stone-500"
                                    >· {type}</span
                                >
                            {/each}
                        </p>
                    </div>
                </a>
            {/each}
        </div>
    {/if}
</div>
