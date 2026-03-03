<script lang="ts">
	import Header from "./Header.svelte";

	let { user, children } = $props();
</script>

<div class="min-h-screen bg-surface">
	<Header {user} />
	<main>
		{@render children()}
	</main>
</div>
