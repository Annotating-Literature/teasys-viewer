<script lang="ts">
	import type { Annotation, Category } from "$lib/types/annotation";
	import CategoryBadge from "./CategoryBadge.svelte";
	import { CATEGORY_META } from "$lib/constants";
	import { fade, slide } from "svelte/transition";

	let {
		annotations,
		title,
		position,
		onSelect,
		onClose,
	}: {
		annotations: Annotation[];
		title: string;
		position: { x: number; y: number };
		onSelect: (id: string, level: number) => void;
		onClose: () => void;
	} = $props();

	// Group annotations by level
	const groupedAnnotations = $derived.by(() => {
		const groups = new Map<number, { ann: Annotation; category: Category; levelNum: number }[]>();
		
		for (const ann of annotations) {
			for (const level of ann.levels) {
				if (!groups.has(level.level)) {
					groups.set(level.level, []);
				}
				groups.get(level.level)!.push({ ann, category: level.category, levelNum: level.level });
			}
		}
		
		// Sort levels ascending
		return Array.from(groups.entries())
			.sort(([a], [b]) => a - b)
			.map(([levelNum, items]) => ({
				levelNum,
				// Sort items within level by category name or just keep order
				items: items.sort((a, b) => a.category.localeCompare(b.category))
			}));
	});

</script>

<svelte:window onkeydown={(e) => e.key === "Escape" && onClose()} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="fixed inset-0 z-50"
	onclick={onClose}
	role="presentation"
>
	<div
		class="absolute bg-surface-card rounded-md shadow-lg border border-gray-200/60 w-64 flex flex-col overflow-hidden"
		style={`left: ${position.x}px; top: ${position.y}px; max-height: 80vh;`}
		onclick={(e) => e.stopPropagation()}
		role="dialog"
		aria-modal="true"
		aria-labelledby="annotation-picker-title"
		tabindex="-1"
		transition:fade={{ duration: 150 }}
	>
		<!-- Header -->
		<div class="px-3 py-2 bg-gray-50 flex justify-between items-center border-b border-gray-200/60 shrink-0">
			<h4 id="annotation-picker-title" class="text-[12px] font-semibold text-gray-800 line-clamp-1 flex-1 font-serif mr-2">
				{title}
			</h4>
			<button
				onclick={onClose}
				class="w-5 h-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 transition-colors shrink-0"
			>
				&times;
			</button>
		</div>

		<!-- Body -->
		<div class="overflow-y-auto px-3 py-2 flex-1">
			{#each groupedAnnotations as group}
				<div class="mb-3 last:mb-1">
					<div class="flex items-center gap-2 mb-1.5">
						<span class="text-[11px] font-bold text-gray-500 min-w-10">Level {group.levelNum}</span>
						<div class="flex-1 h-px bg-slate-300"></div>
					</div>
					<div class="flex flex-col gap-1 items-start">
						{#each group.items as item}
							<button 
								class="hover:opacity-80 transition-opacity focus:outline-none focus:ring-1 focus:ring-primary-400 rounded-md"
								onclick={() => onSelect(item.ann.id, group.levelNum)}
							>
								<CategoryBadge category={item.category} />
							</button>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
