<script lang="ts">
	import IconQuill from "$lib/components/icons/IconQuill.svelte";
	import IconNotebook from "$lib/components/icons/IconNotebook.svelte";
	import IconTheatreMasks from "$lib/components/icons/IconTheatreMasks.svelte";

	let { texts, totalTexts, totalAnnotations, byType, typeLabel } = $props<{
		texts: any[];
		totalTexts: number;
		totalAnnotations: number;
		byType: Record<string, number>;
		typeLabel: Record<string, string>;
	}>();
</script>

<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
		<p class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
			<svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3">
				<rect x="2" y="1" width="12" height="14" rx="1" />
				<path d="M5 4h6M5 7h6M5 10h4" />
			</svg>
			Texts
		</p>
		<p class="text-2xl font-bold text-gray-900">{totalTexts}</p>
	</div>
	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
		<p class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
			Annotations
		</p>
		<p class="text-2xl font-bold text-gray-900">{totalAnnotations}</p>
	</div>
	{#each ["poetry", "prose", "drama"] as type}
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
			<p class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
				{#if type === "poetry"}
					<IconQuill class="w-3.5 h-3.5" />
				{:else if type === "prose"}
					<IconNotebook class="w-3.5 h-3.5" />
				{:else}
					<IconTheatreMasks class="w-3.5 h-3.5" />
				{/if}
				{typeLabel[type]}
			</p>
			<p class="text-2xl font-bold text-gray-900">
				{byType[type] || 0}
			</p>
		</div>
	{/each}
</div>
