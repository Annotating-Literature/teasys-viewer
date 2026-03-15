<script lang="ts">
    import type { PageData } from "./$types";

    let { data } = $props();
</script>

<svelte:head>
    <title>Edit Author: {data.author} — Admin</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-10">
    <div class="mb-8">
        <nav class="text-m text-gray-500 mb-4">
            <a href="/admin" class="hover:text-primary-600 transition-colors">
                Admin
            </a>
            <span class="mx-1.5">›</span>
            <a
                href="/authors/{data.slug}"
                class="hover:text-primary-600 transition-colors"
            >
                {data.author}
            </a>
            <span class="mx-1.5">›</span>
            <span class="text-gray-600">Edit Profile</span>
        </nav>

        <h1 class="text-2xl font-bold text-gray-900">Edit Author Profile</h1>
        <p class="text-m text-gray-500 mt-1">{data.author}</p>
    </div>

    <form method="POST" enctype="multipart/form-data" class="space-y-6">
        <!-- Portrait -->
        <div>
            <label
                for="portrait"
                class="block text[13px] font-medium text-gray-600 mb-2"
            >
                Portrait Image
            </label>
            {#if data.portraitPath}
                <div class="mb-3">
                    <img
                        src={data.portraitPath}
                        alt="Current portrait of {data.author}"
                        class="w-32 h-32 object-cover rounded-xl border border-gray-200"
                    />
                </div>
            {/if}
            <input
                type="file"
                id="portrait"
                name="portrait"
                accept="image/jpeg,image/png,image/webp"
                class="text-m text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-m file:font-medium file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100 file:transition-colors file:cursor-pointer"
            />
            <p class="text-[11px] text-gray-500 mt-1">
                JPG, PNG, or WebP. Will be displayed as a small portrait on the
                author page.
            </p>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label
                    for="birthYear"
                    class="block text-[13px] font-medium text-gray-600 mb-2"
                >
                    Birth Year
                </label>
                <input
                    type="number"
                    id="birthYear"
                    name="birthYear"
                    value={data.birthYear ?? ""}
                    placeholder="e.g. 1809"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                />
            </div>
            <div>
                <label
                    for="deathYear"
                    class="block text-[13px] font-medium text-gray-600 mb-2"
                >
                    Death Year
                </label>
                <input
                    type="number"
                    id="deathYear"
                    name="deathYear"
                    value={data.deathYear ?? ""}
                    placeholder="e.g. 1849"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                />
            </div>
        </div>

        <!-- Photo Credit -->
        <div class="grid grid-cols-2 gap-4">
            <div>
                <label
                    for="photoCredit"
                    class="block text-[13px] font-medium text-gray-600 mb-2"
                >
                    Photo Credit
                </label>
                <input
                    type="text"
                    id="photoCredit"
                    name="photoCredit"
                    value={data.photoCredit ?? ""}
                    placeholder="e.g. Wikimedia Commons"
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                />
            </div>
            <div>
                <label
                    for="photoCreditUrl"
                    class="block text-[13px] font-medium text-gray-600 mb-2"
                >
                    Photo Credit URL
                </label>
                <input
                    type="url"
                    id="photoCreditUrl"
                    name="photoCreditUrl"
                    value={data.photoCreditUrl ?? ""}
                    placeholder="https://..."
                    class="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-400"
                />
            </div>
        </div>

        <!-- Bio -->
        <div>
            <label
                for="bio"
                class="block text[13px] font-medium text-gray-600 mb-2"
            >
                Biography <span class="text-gray-500">(Markdown)</span>
            </label>
            <textarea
                id="bio"
                name="bio"
                class="w-full h-64 px-4 py-3 text-m border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500 resize-y font-mono"
                placeholder="Write a short biography for this author..."
                >{data.bio}</textarea
            >
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-3 pt-2">
            <button
                type="submit"
                class="px-5 py-2.5 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
            >
                Save Profile
            </button>
            <a
                href="/authors/{data.slug}"
                class="text-m text-gray-500 hover:text-gray-700 transition-colors"
            >
                Cancel
            </a>
        </div>
    </form>
</div>
