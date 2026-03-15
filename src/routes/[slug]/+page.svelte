<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
    import { slugify } from "$lib/utils/slug";

    let { data } = $props();
</script>

<svelte:head>
    <title>{data.page.title} — TEASys Viewer</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-12 md:py-16">
    <!-- Optional breadcrumbs -->
    <div class="mb-10 lg:mb-16">
        <Breadcrumbs
            crumbs={[{ label: "Home", href: "/" }, { label: data.page.title }]}
        />
    </div>

    <div
        class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8 sm:p-12 mb-12"
    >
        <article
            class="prose prose-slate md:prose-lg max-w-none
			prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-6
			prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-10
			prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12
			prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8
			prose-p:text-gray-900 prose-p:leading-relaxed prose-p:mb-6
			prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline hover:prose-a:text-primary-700 transition-colors
			prose-strong:font-semibold prose-strong:text-gray-900
			prose-ul:list-disc prose-ol:list-decimal prose-li:text-gray-900 prose-li:my-2
			prose-blockquote:border-l-4 prose-blockquote:border-primary-200 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
			dark:prose-invert dark:prose-blockquote:border-primary-800"
        >
            {@html data.htmlContent}
        </article>
    </div>

    {#if data.categoryTexts && data.categoryTexts.length > 0}
        <div class="mt-16">
            <h2
                class="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-3"
            >
                {data.page.title} Texts
                <div class="flex-1 h-px bg-gray-200"></div>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {#each data.categoryTexts as text}
                    <div
                        class="group block relative p-5 bg-surface-card backdrop-blur-sm border border-gray-200/60 rounded-xl hover:bg-surface-elevated hover:border-gray-400 hover:shadow-[2px_2px_12px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 ease-out"
                    >
                        <h4
                            class="text-base font-semibold text-gray-800 group-hover:text-primary-700 transition-colors leading-snug font-serif"
                        >
                            <a
                                href={`/texts/${text.id}`}
                                class="after:absolute after:inset-0"
                            >
                                {text.title}
                            </a>
                        </h4>
                        <p class="text-sm text-gray-500 mt-1 relative z-10">
                            <a
                                href={`/authors/${slugify(text.author)}`}
                                class="hover:text-primary-600 transition-colors"
                            >
                                {text.author}
                            </a>
                            {#if text.year}
                                <span class="text-gray-500 mx-1.5">·</span
                                >{text.year}
                            {/if}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>
