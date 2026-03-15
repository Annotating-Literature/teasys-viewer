<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
    import { enhance } from "$app/forms";

    let { data } = $props();
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
        <div
            class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
        >
            {#each data.pages as page, i}
                <div
                    class="flex items-center justify-between p-4 {i > 0
                        ? 'border-t border-gray-50'
                        : ''} hover:bg-gray-50/50 transition-colors"
                >
                    <div class="min-w-0 flex-1">
                        <p class="font-semibold text-m text-gray-900">
                            {page.title}
                        </p>
                        <p class="text-[13px] text-gray-500 mt-0.5">
                            Slug: /{page.id}
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
                            use:enhance={() => {
                                return ({ result, update }) => {
                                    if (result.type === "success") update();
                                    else alert("Failed to delete page");
                                };
                            }}
                            onsubmit={(e) => {
                                if (
                                    !confirm(
                                        "Delete this page? This cannot be undone.",
                                    )
                                )
                                    e.preventDefault();
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
            {/each}
        </div>
    {/if}
</div>
