<script lang="ts">
	import { SITE } from '$lib/config/site';
	import { page } from '$app/stores';

	let {
		title = '',
		description = SITE.description,
		canonical = '',
		type = 'website',
		image = '',
		noindex = false,
		jsonLd = null,
	}: {
		title?: string;
		description?: string;
		canonical?: string;
		type?: 'website' | 'article' | 'profile' | 'book';
		image?: string;
		noindex?: boolean;
		jsonLd?: Record<string, unknown> | null;
	} = $props();

	const fullTitle = title ? `${title} — ${SITE.name}` : SITE.name;
	const canonicalUrl = $derived(
		SITE.siteUrl ? `${SITE.siteUrl}${canonical || $page.url.pathname}` : ''
	);
	const ogImage = $derived(image || (SITE.siteUrl ? `${SITE.siteUrl}/og-image.png` : ''));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />

	{#if noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else if canonicalUrl}
		<link rel="canonical" href={canonicalUrl} />
	{/if}

	<!-- Open Graph -->
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	{#if canonicalUrl}<meta property="og:url" content={canonicalUrl} />{/if}
	{#if ogImage}<meta property="og:image" content={ogImage} />{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}<meta name="twitter:image" content={ogImage} />{/if}

	<!-- JSON-LD -->
	{#if jsonLd}
		{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
	{/if}
</svelte:head>
