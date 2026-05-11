<script lang="ts">
    import { SITE } from '$lib/config/site';
</script>

<footer class="border-t border-gray-200/50 mt-20">
    <div class="max-w-5xl mx-auto px-6 py-8">
        <div
            class="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
            <div class="flex items-center gap-2 text-m text-gray-500">
                <span class="font-serif text-gray-400">Θ</span>
                <span>{SITE.name}</span>
                <span class="text-gray-300">·</span>
                <span class="text-[13px]">{SITE.version}</span>
            </div>
            <div class="flex items-center gap-3 text-[13px] text-gray-500">
                <p class="text-center max-w-sm leading-relaxed">
                    © {SITE.copyrightFrom}–{new Date().getFullYear()} {SITE.copyrightHolder}.
                    All rights reserved.
                </p>
                <p class="text-right max-w-sm leading-relaxed">
                    {SITE.tagline}
                </p>
                <span class="text-gray-300">·</span>
                <a
                    href="/{SITE.impressumSlug}"
                    class="hover:text-primary-600 transition-colors whitespace-nowrap"
                    >Impressum</a
                >
            </div>
        </div>
    </div>
</footer>
