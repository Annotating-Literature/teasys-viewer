<script lang="ts">
    import type { PageData } from "./$types";
    import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
    import { enhance } from "$app/forms";
    import { page } from "$app/stores";

    let { data } = $props();

    let title = $state("");
    let content = $state("");
    let saving = $state(false);

    let fileInput = $state<HTMLInputElement | null>(null);
    let isUploading = $state(false);
    let textareaRef = $state<HTMLTextAreaElement | null>(null);

    $effect(() => {
        title = data.page?.title || "";
        content = data.content || "";
    });

    const isNew = $derived($page.params.slug === "new");

    async function uploadImage(e: Event) {
        const target = e.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        isUploading = true;
        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("/api/upload/pages", {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");
            const result = await res.json();

            insertAtCursor(`![${file.name.split(".")[0]}](${result.url})`);
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert("Failed to upload image.");
        } finally {
            isUploading = false;
            if (fileInput) fileInput.value = "";
        }
    }

    function insertAtCursor(text: string) {
        if (!textareaRef) return;
        const start = textareaRef.selectionStart;
        const end = textareaRef.selectionEnd;
        content = content.substring(0, start) + text + content.substring(end);

        setTimeout(() => {
            textareaRef?.focus();
            textareaRef?.setSelectionRange(
                start + text.length,
                start + text.length,
            );
        }, 0);
    }
</script>

<svelte:head>
    <title
        >{isNew ? "Create Page" : `Edit ${data.page?.title}`} — TEASys Viewer</title
    >
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
    <div class="mb-8">
        <Breadcrumbs
            crumbs={[
                { label: "Library", href: "/" },
                { label: "Admin", href: "/admin" },
                { label: "Pages", href: "/admin/pages" },
                { label: isNew ? "New Page" : data.page?.title || "Edit Page" },
            ]}
        />
        <h1 class="text-2xl font-bold text-gray-900 mt-2">
            {isNew ? "Create New Page" : `Edit Page`}
        </h1>
    </div>

    <form
        method="POST"
        use:enhance={() => {
            saving = true;
            return async ({ update }) => {
                await update();
                saving = false;
            };
        }}
        class="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
    >
        <div class="grid gap-6">
            <div>
                <label
                    for="title"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Page Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    bind:value={title}
                    required
                    placeholder="e.g., About Us, Meeting Times"
                    class="w-full px-4 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-serif"
                />
                <p class="mt-1.5 text-[13px] text-gray-500">
                    {#if isNew}
                        A URL-friendly slug will be automatically created from
                        this title.
                    {:else}
                        Slug: <code>/{data.page?.id}</code>
                    {/if}
                </p>
            </div>

            <div>
                <label
                    for="content"
                    class="flex text-sm font-medium text-gray-700 mb-1 items-center justify-between"
                >
                    Content
                    <div class="flex items-center gap-3">
                        <input
                            type="file"
                            accept="image/*"
                            class="hidden"
                            bind:this={fileInput}
                            onchange={uploadImage}
                        />
                        <button
                            type="button"
                            onclick={() => fileInput?.click()}
                            disabled={isUploading}
                            class="flex items-center gap-1 text-[12px] font-medium text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"
                        >
                            <svg
                                class="w-3.5 h-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L28 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            {isUploading ? "Uploading..." : "Insert Image"}
                        </button>
                        <span class="text-[11px] font-normal text-gray-400"
                            >Markdown supported</span
                        >
                    </div>
                </label>
                <textarea
                    id="content"
                    name="content"
                    bind:value={content}
                    bind:this={textareaRef}
                    required
                    rows="18"
                    placeholder="# Heading&#10;&#10;Write your page content here..."
                    class="w-full px-4 py-3 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-mono resize-y"
                ></textarea>
            </div>

            <div
                class="flex items-center justify-end gap-3 pt-4 border-t border-gray-50 mt-2"
            >
                <a
                    href="/admin/pages"
                    class="px-5 py-2 text-m font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Cancel
                </a>
                <button
                    type="submit"
                    disabled={saving || !title?.trim() || !content?.trim()}
                    class="px-5 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {#if saving}
                        <svg
                            class="animate-spin w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke-width="3"
                                stroke-dasharray="32"
                                stroke-dashoffset="16"
                                stroke-linecap="round"
                            ></circle>
                        </svg>
                        Saving...
                    {:else}
                        {isNew ? "Publish Page" : "Save Changes"}
                    {/if}
                </button>
            </div>
        </div>
    </form>
</div>
