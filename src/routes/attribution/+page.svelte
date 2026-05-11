<script lang="ts">
    import Breadcrumbs from '$lib/components/layout/Breadcrumbs.svelte';
    import Seo from '$lib/components/Seo.svelte';
    import { SITE } from '$lib/config/site';
    import { FONTS } from '$lib/config/fonts';

    const software: { name: string; url: string; license: string; note?: string }[] = [
        { name: 'SvelteKit', url: 'https://kit.svelte.dev', license: 'MIT' },
        { name: 'Svelte', url: 'https://svelte.dev', license: 'MIT' },
        { name: 'Tailwind CSS', url: 'https://tailwindcss.com', license: 'MIT' },
        { name: 'marked', url: 'https://github.com/markedjs/marked', license: 'MIT', note: 'Markdown parsing' },
        { name: 'DOMPurify', url: 'https://github.com/cure53/DOMPurify', license: 'Apache-2.0 / MPL-2.0', note: 'HTML sanitization' },
        { name: 'bcryptjs', url: 'https://github.com/dcodeIO/bcrypt.js', license: 'MIT', note: 'Password hashing' },
        { name: 'uuid', url: 'https://github.com/uuidjs/uuid', license: 'MIT' },
        { name: 'Zod', url: 'https://zod.dev', license: 'MIT', note: 'Schema validation' },
    ];

    const fonts: { name: string; url: string; license: string; designer?: string }[] = [
        { name: 'Gentium Plus', url: 'https://software.sil.org/gentium/', license: 'SIL OFL 1.1', designer: 'SIL International' },
        { name: 'EB Garamond', url: 'https://github.com/octaviopardo/EBGaramond12', license: 'SIL OFL 1.1', designer: 'Georg Duffner' },
        { name: 'Goudy Bookletter 1911', url: 'https://fonts.google.com/specimen/Goudy+Bookletter+1911', license: 'SIL OFL 1.1', designer: 'Barry Schwartz' },
        { name: 'Sorts Mill Goudy', url: 'https://fonts.google.com/specimen/Sorts+Mill+Goudy', license: 'SIL OFL 1.1', designer: 'Barry Schwartz' },
    ];
</script>

<Seo title="Attribution" description="Open-source software, typefaces, and content credits for {SITE.name}." canonical="/attribution" />

<div class="max-w-4xl mx-auto px-6 py-12 md:py-16">
    <div class="mb-10">
        <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Attribution' }]} />
        <h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 font-serif leading-tight mt-4 mb-2">
            Attribution
        </h1>
        <p class="text-gray-500 mt-3 text-lg">
            {SITE.name} is built on open-source software and typefaces. We gratefully acknowledge the following.
        </p>
    </div>

    <div class="space-y-8">
        <!-- Content attributions placeholder -->
        <section class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8">
            <h2 class="text-xl font-bold font-serif text-gray-900 mb-1">Content</h2>
            <p class="text-sm text-gray-500 mb-6">Add credits for the texts, images, and other content published on this site.</p>
            <p class="text-gray-400 italic text-sm">— No content attributions added yet.</p>
        </section>

        <!-- Software -->
        <section class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8">
            <h2 class="text-xl font-bold font-serif text-gray-900 mb-6">Open-Source Software</h2>
            <ul class="divide-y divide-gray-100">
                {#each software as dep}
                    <li class="py-3 flex items-baseline justify-between gap-4">
                        <div>
                            <a href={dep.url} target="_blank" rel="noopener noreferrer"
                               class="font-medium text-gray-900 hover:text-primary-600 transition-colors">
                                {dep.name}
                            </a>
                            {#if dep.note}
                                <span class="text-gray-400 text-sm ml-2">— {dep.note}</span>
                            {/if}
                        </div>
                        <span class="text-xs text-gray-400 font-mono shrink-0">{dep.license}</span>
                    </li>
                {/each}
            </ul>
        </section>

        <!-- Fonts -->
        <section class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8">
            <h2 class="text-xl font-bold font-serif text-gray-900 mb-6">Typefaces</h2>
            <ul class="divide-y divide-gray-100">
                {#each fonts as font}
                    <li class="py-3 flex items-baseline justify-between gap-4">
                        <div>
                            <a href={font.url} target="_blank" rel="noopener noreferrer"
                               class="font-medium text-gray-900 hover:text-primary-600 transition-colors font-serif">
                                {font.name}
                            </a>
                            {#if font.designer}
                                <span class="text-gray-400 text-sm ml-2">— {font.designer}</span>
                            {/if}
                        </div>
                        <span class="text-xs text-gray-400 font-mono shrink-0">{font.license}</span>
                    </li>
                {/each}
            </ul>
        </section>

        <!-- License -->
        <section class="bg-surface-card rounded-xl border border-gray-200/50 shadow-sm p-8">
            <h2 class="text-xl font-bold font-serif text-gray-900 mb-4">Software License</h2>
            <p class="text-gray-600 text-sm leading-relaxed">
                {SITE.name} is built on
                <a href="https://github.com/noc-tae/teasys-viewer" target="_blank" rel="noopener noreferrer"
                   class="text-primary-600 hover:underline">TEASys Viewer</a>,
                open-source software released under the
                <a href="https://github.com/noc-tae/teasys-viewer/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"
                   class="text-primary-600 hover:underline">MIT License with Attribution Requirement</a>.
                The licence permits free use, modification, and redistribution provided this credit is retained.
            </p>
            <p class="text-gray-500 text-sm leading-relaxed mt-3">
                The content published through this application — texts, annotations, author biographies, and images —
                is not covered by this licence and remains the property of its respective rights holders.
            </p>
            {#if FONTS.serif.source === 'google' || FONTS.sans.source === 'google'}
            <p class="text-gray-500 text-sm leading-relaxed mt-3">
                This site loads fonts from Google Fonts. By visiting, your browser sends a request to Google's servers.
                See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"
                       class="text-primary-600 hover:underline">Google's Privacy Policy</a>.
            </p>
            {/if}
        </section>
    </div>
</div>
