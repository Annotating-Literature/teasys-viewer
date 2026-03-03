<script lang="ts">
	import Header from "./Header.svelte";
	import Footer from "./Footer.svelte";

	let { user, children } = $props();
</script>

<div class="min-h-screen bg-surface flex flex-col">
	<Header {user} />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
