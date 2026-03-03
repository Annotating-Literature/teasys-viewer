<script lang="ts">
	import type { Category } from "$lib/types/annotation";
	import { LEVEL_1_ALLOWED_CATEGORIES, CATEGORY_META } from "$lib/constants";

	type Props = {
		id: string;
		selected: Category | "";
		level: 1 | 2 | 3;
		onChange: (selected: Category) => void;
	};
	let { id, selected, level, onChange }: Props = $props();

	const availableCategories = $derived(
		level === 1
			? LEVEL_1_ALLOWED_CATEGORIES
			: (Object.keys(CATEGORY_META) as Category[]),
	);
</script>

<select
	{id}
	class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
	value={selected}
	onchange={(e) => onChange(e.currentTarget.value as Category)}
>
	<option disabled value="">Select a category</option>
	{#each availableCategories as category}
		<option value={category}>{CATEGORY_META[category].label}</option>
	{/each}
</select>
