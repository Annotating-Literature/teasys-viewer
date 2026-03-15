<script lang="ts">
	import { CATEGORY_META } from "$lib/constants";
	import type { Category } from "$lib/types/annotation";

	let { category }: { category: Category } = $props();

	const meta = $derived(CATEGORY_META[category]);
</script>

<span
	class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[13px] font-medium"
	style="background-color: {meta.color}20; color: {meta.color};"
>
	<span class="w-1.5 h-1.5 rounded-full" style:background-color={meta.color}
	></span>
	{meta.label}
</span>
