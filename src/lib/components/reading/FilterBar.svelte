<script lang="ts">
	import { CATEGORIES, CATEGORY_META } from "$lib/constants";
	import type { Category } from "$lib/types/annotation";

	export type Filters = {
		categories: Set<Category>;
	};

	let {
		filters,
		onChange,
	}: {
		filters: Filters;
		onChange: (newFilters: Filters) => void;
	} = $props();

	function toggleCategory(category: Category) {
		const newCategories = new Set(filters.categories);
		if (newCategories.has(category)) newCategories.delete(category);
		else newCategories.add(category);
		onChange({ ...filters, categories: newCategories });
	}

	function areAllCategoriesSet() {
		return filters.categories.size === CATEGORIES.length;
	}

	function toggleAll() {
		if (areAllCategoriesSet()) {
			onChange({ ...filters, categories: new Set() });
		} else {
			onChange({ ...filters, categories: new Set(CATEGORIES) });
		}
	}
</script>

<div class="mb-4 sticky top-18 z-10">
	<div class="flex flex-wrap items-center gap-1.5 py-2">
		<span
			class="text-[11px] font-medium text-gray-400 uppercase tracking-wider mr-1"
			>Filter</span
		>

		{#each CATEGORIES as category}
			{@const meta = CATEGORY_META[category]}
			<button
				onclick={() => toggleCategory(category)}
				class="px-2 py-0.5 text-[11px] font-medium rounded transition-all duration-150 whitespace-nowrap"
				class:opacity-100={filters.categories.has(category)}
				class:opacity-30={!filters.categories.has(category)}
				class:hover:opacity-60={!filters.categories.has(category)}
				style:background-color={meta.bg}
				style:color={meta.color}
			>
				{meta.label}
			</button>
		{/each}

		<button
			onclick={toggleAll}
			class="text-[11px] font-medium text-gray-400 hover:text-gray-600 transition-colors ml-auto"
		>
			{areAllCategoriesSet() ? "Clear" : "All"}
		</button>
	</div>
</div>
