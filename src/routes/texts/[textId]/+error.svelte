<script lang="ts">
    import { page } from "$app/stores";
    import Header from "$lib/components/layout/Header.svelte";
</script>

<svelte:head>
    <title>Error Loading Text — TEASys Viewer</title>
</svelte:head>

<Header user={$page.data.user} />

<div class="min-h-[70vh] flex items-center justify-center px-6">
    <div class="max-w-md w-full text-center space-y-6">
        <div
            class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
            <svg
                class="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
            </svg>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
            Unable to load text
        </h1>

        <p class="text-gray-600 leading-relaxed">
            There was an error parsing the annotations for this text. The
            underlying text data might be corrupted or improperly formatted.
        </p>

        {#if $page.status}
            <div
                class="bg-gray-50 rounded-lg p-4 text-left font-mono text-[13px] text-gray-700 overflow-x-auto border border-gray-100 mt-6"
            >
                Status: {$page.status}
                {#if $page.error?.message}
                    <br />Message: {$page.error.message}
                {/if}
            </div>
        {/if}

        <div class="pt-6">
            <a
                href="/"
                class="inline-flex justify-center items-center px-6 py-2.5 text-sm font-medium
					   bg-gray-900 text-white hover:bg-gray-800 rounded-lg transition-colors
					   shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
                Return to Library
            </a>
        </div>
    </div>
</div>
