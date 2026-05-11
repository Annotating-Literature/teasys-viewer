<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
    import { slugify } from "$lib/utils/slug";
    import Seo from "$lib/components/Seo.svelte";

    let { data } = $props();

    // Group category texts by their category field
    const groupedByCategory = $derived.by(() => {
        if (!data.categoryTexts) return [];
        const catMap: Record<string, any[]> = {};
        for (const t of data.categoryTexts) {
            const cat = t.category || "Uncategorized";
            if (!catMap[cat]) catMap[cat] = [];
            catMap[cat].push(t);
        }
        return Object.entries(catMap)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([name, texts]) => ({ name, texts }));
    });
</script>

<Seo title={data.page.title} canonical="/{data.page.id}" />

<div class="max-w-4xl mx-auto px-6 py-12 md:py-16">
    <!-- Breadcrumbs + page heading outside the card -->
    <div class="mb-10">
        <Breadcrumbs
            crumbs={[{ label: "Home", href: "/" }, { label: data.page.title }]}
        />
        <h1
            class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight mt-4 mb-2"
        >
            {data.page.title}
        </h1>
    </div>

    {#if data.htmlContent && data.htmlContent.trim().length > 0}
        <div
            class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8 sm:p-12 mb-12"
        >
            <article
                class="prose prose-slate md:prose-lg max-w-prose
                prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-6
                prose-h1:hidden
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10
                prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8
                prose-p:text-gray-900 prose-p:leading-relaxed prose-p:mb-6 [&_p]:text-wrap-pretty
                prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700 transition-colors
                prose-strong:font-semibold prose-strong:text-gray-900
                prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-900 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
                dark:prose-invert dark:prose-blockquote:border-primary-800"
            >
                {@html data.htmlContent}
            </article>
        </div>
    {/if}

    {#if groupedByCategory.length > 0}
        <div class="mt-8">
            {#each groupedByCategory as category}
                <div class="mb-10">
                    <h3
                        class="text-[11px] uppercase tracking-[0.15em] font-semibold text-gray-400 mb-4 flex items-center gap-3"
                    >
                        {category.name}
                        <span
                            class="flex-1 border-t border-dotted border-gray-300 dark:border-gray-700"
                        ></span>
                    </h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {#each category.texts as text}
                            <div
                                class="group block relative p-5 bg-surface-card backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-surface-elevated hover:border-gray-400 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 ease-out"
                            >
                                <h4
                                    class="text-base font-semibold text-gray-800 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-snug font-serif"
                                >
                                    <a
                                        href={`/texts/${text.id}`}
                                        class="after:absolute after:inset-0"
                                    >
                                        {text.title}
                                    </a>
                                </h4>
                                <p
                                    class="text-sm text-gray-500 dark:text-gray-400 mt-1 relative z-10"
                                >
                                    <a
                                        href={`/authors/${slugify(text.author)}`}
                                        class="hover:text-primary-600 transition-colors"
                                    >
                                        {text.author}
                                    </a>
                                    {#if text.year}
                                        <span
                                            class="text-gray-400 dark:text-gray-600 mx-1.5"
                                            >·</span
                                        >{text.year}
                                    {/if}
                                </p>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
