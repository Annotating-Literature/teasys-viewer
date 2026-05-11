<script lang="ts">
	import "./layout.css";
	import PageShell from "$lib/components/layout/PageShell.svelte";
	import { FONTS } from "$lib/config/fonts";

	let { data, children } = $props();
</script>

<svelte:head>
	{#if FONTS.serif.source === 'google' && FONTS.serif.googleUrl}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link rel="stylesheet" href={FONTS.serif.googleUrl} />
	{/if}
	{#if FONTS.sans.source === 'google' && FONTS.sans.googleUrl}
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
		<link rel="stylesheet" href={FONTS.sans.googleUrl} />
	{/if}
</svelte:head>

<PageShell user={data.user} availableTypes={data.availableTypes} pages={data.pages}>
	{@render children()}
</PageShell>
