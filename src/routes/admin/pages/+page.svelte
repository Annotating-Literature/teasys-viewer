<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
    import { enhance } from "$app/forms";

    let { data } = $props();

    // Build a grouped hierarchy: top-level pages with their children below
    const grouped = $derived.by(() => {
        const topLevel = data.pages.filter(p => !p.parent);
        const childrenByParent = new Map<string, typeof data.pages>();
        for (const p of data.pages) {
            if (!p.parent) continue;
            if (!childrenByParent.has(p.parent)) childrenByParent.set(p.parent, []);
            childrenByParent.get(p.parent)!.push(p);
        }
        return topLevel.map(p => ({ page: p, children: childrenByParent.get(p.id) ?? [] }));
    });
</script>

<svelte:head>
    <title>Manage Pages — TEASys Viewer</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
    <div class="mb-8 flex items-end justify-between">
        <div>
            <Breadcrumbs
                crumbs={[
                    { label: "Library", href: "/" },
                    { label: "Admin", href: "/admin" },
                    { label: "Pages" },
                ]}
            />
            <h1 class="text-2xl font-bold text-gray-900 mt-2">Manage Pages</h1>
            <p class="text-[13px] text-gray-500 mt-1">Use ▲ ▼ to set the order pages appear in the navigation. Child pages are indented under their parent.</p>
        </div>
        <a
            href="/admin/pages/new"
            class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
        >
            Create Page
        </a>
    </div>

    {#if data.pages.length === 0}
        <div
            class="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
        >
            <h3 class="text-lg font-semibold text-gray-900">No pages found</h3>
            <p class="mt-2 text-gray-500">
                Create a new static page to publish content.
            </p>
        </div>
    {:else}
        <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {#each grouped as { page, children }, gi}
                <!-- Top-level page row -->
                {@render pageRow(page, gi === 0, gi === grouped.length - 1, false)}

                <!-- Child pages, indented -->
                {#each children as child, ci}
                    {@render pageRow(child, ci === 0, ci === children.length - 1, true)}
                {/each}
            {/each}
        </div>
    {/if}
</div>

{#snippet pageRow(page: typeof data.pages[0], isFirst: boolean, isLast: boolean, isChild: boolean)}
    <div
        class="flex items-center gap-2 py-3 border-t border-gray-50 first:border-t-0 hover:bg-gray-50/50 transition-colors {isChild ? 'pl-10 pr-4 bg-gray-50/40' : 'pl-4 pr-4'}"
    >
        <!-- Indent marker for child pages -->
        {#if isChild}
            <svg class="w-3 h-3 shrink-0 text-gray-300 -ml-1 mr-1" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                <path d="M2 2v6h8"/>
            </svg>
        {/if}

        <!-- Reorder buttons -->
        <div class="flex flex-col gap-0.5 shrink-0">
            <form method="POST" action="?/move" use:enhance={() => ({ result, update }) => { if (result.type === 'success') update(); }}>
                <input type="hidden" name="slug" value={page.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                    type="submit"
                    disabled={isFirst}
                    class="w-6 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Move up"
                >
                    <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 8l4-4 4 4"/>
                    </svg>
                </button>
            </form>
            <form method="POST" action="?/move" use:enhance={() => ({ result, update }) => { if (result.type === 'success') update(); }}>
                <input type="hidden" name="slug" value={page.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                    type="submit"
                    disabled={isLast}
                    class="w-6 h-5 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                    title="Move down"
                >
                    <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 4l4 4 4-4"/>
                    </svg>
                </button>
            </form>
        </div>

        <div class="min-w-0 flex-1">
            <p class="font-semibold text-m text-gray-900 {isChild ? 'text-[14px]' : ''}">
                {page.title}
            </p>
            <p class="text-[12px] text-gray-400 mt-0.5">
                /{page.id}
            </p>
        </div>

        <div class="flex items-center gap-3 ml-4">
            <a
                href={`/${page.id}`}
                target="_blank"
                class="text-[13px] font-medium text-gray-500 hover:text-gray-700 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors"
            >
                View
            </a>
            <a
                href={`/admin/pages/${page.id}`}
                class="text-[13px] font-medium text-primary-600 hover:text-primary-700 px-2.5 py-1 rounded-md hover:bg-primary-50 transition-colors"
            >
                Edit
            </a>
            <form
                method="POST"
                action="?/delete"
                use:enhance={() => ({ result, update }) => {
                    if (result.type === 'success') update();
                    else alert('Failed to delete page');
                }}
                onsubmit={(e) => {
                    if (!confirm('Delete this page? This cannot be undone.')) e.preventDefault();
                }}
            >
                <input type="hidden" name="slug" value={page.id} />
                <button
                    type="submit"
                    class="text-[13px] font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
                >
                    Delete
                </button>
            </form>
        </div>
    </div>
{/snippet}
