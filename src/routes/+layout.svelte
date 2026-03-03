<script lang="ts">
	import './layout.css';
	import PageShell from '$lib/components/layout/PageShell.svelte';
	import type { PageData } from './$types';

	let { data, children } = $props();
</script>

<PageShell user={data.user}>
	{@render children()}
</PageShell>
