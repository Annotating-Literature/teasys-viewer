<script lang="ts">
    let { crumbs }: { crumbs: { label: string; href?: string }[] } = $props();
</script>

<nav class="flex items-center gap-1.5 text-m text[13px]tone-500 mb-4">
    {#each crumbs as crumb, i}
        {#if i > 0}
            <span class="text[13px]tone-400">›</span>
        {/if}
        {#if crumb.href}
            <a
                href={crumb.href}
                class="hover:text-primary-600 transition-colors"
            >
                {crumb.label}
            </a>
        {:else}
            <span class="text[13px]tone-600">{crumb.label}</span>
        {/if}
    {/each}
</nav>
