<script lang="ts">
	import type { Annotation } from "$lib/types/annotation";
	import CategoryBadge from "./CategoryBadge.svelte";

	let {
		annotations,
		position,
		onPick,
	}: {
		annotations: Annotation[];
		position: { top: number; left: number };
		onPick: (id: string) => void;
	} = $props();
</script>

<div
	class="absolute z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[280px]"
	style:top={`${position.top}px`}
	style:left={`${position.left}px`}
>
	<h4 class="text-xs font-bold text-gray-500 uppercase px-2 pt-1 pb-2">
		Select Annotation
	</h4>
	<ul>
		{#each annotations as ann (ann.id)}
			<li>
				<button
					onclick={() => onPick(ann.id)}
					class="w-full text-left flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gray-100"
				>
					<CategoryBadge category={ann.levels[0].category} />
					<span class="truncate text-sm text-gray-700"
						>“{ann.anchorText}”</span
					>
				</button>
			</li>
		{/each}
	</ul>
</div>
