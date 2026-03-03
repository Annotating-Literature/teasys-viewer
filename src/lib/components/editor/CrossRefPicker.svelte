<script lang="ts">
	import type { CrossRef, Annotation } from "$lib/types/annotation";

	type Props = {
		crossRefs: CrossRef[];
		availableAnnotations: Annotation[];
		onChange: (crossRefs: CrossRef[]) => void;
	};
	let { crossRefs, availableAnnotations, onChange }: Props = $props();

	let searchQuery = $state("");
	let showDropdown = $state(false);

	const filtered = $derived(
		availableAnnotations
			.filter(
				(ann) =>
					!crossRefs.some((ref) => ref.annotationId === ann.id) &&
					ann.anchorText
						.toLowerCase()
						.includes(searchQuery.toLowerCase()),
			)
			.slice(0, 8),
	);

	function addRef(ann: Annotation) {
		const ref: CrossRef = {
			annotationId: ann.id,
			annotationTitle: ann.anchorText.slice(0, 50),
			level: ann.levels[0].level,
			category: ann.levels[0].category,
		};
		onChange([...crossRefs, ref]);
		searchQuery = "";
		showDropdown = false;
	}

	function removeRef(ref: CrossRef) {
		onChange(crossRefs.filter((r) => r.annotationId !== ref.annotationId));
	}
</script>

<div>
	<h4 class="text-xs font-medium text-gray-600 mb-2">Cross-references</h4>

	{#if crossRefs.length > 0}
		<div class="flex flex-wrap gap-1.5 mb-3">
			{#each crossRefs as ref}
				<span
					class="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md border border-primary-100"
				>
					"{ref.annotationTitle}"
					<button
						onclick={() => removeRef(ref)}
						class="text-primary-400 hover:text-red-500 transition-colors ml-0.5"
						>&times;</button
					>
				</span>
			{/each}
		</div>
	{/if}

	<div class="relative">
		<input
			type="text"
			class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg
			       focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500
			       transition-all placeholder:text-gray-500"
			placeholder="Search annotations to link..."
			bind:value={searchQuery}
			onfocus={() => (showDropdown = true)}
			onblur={() => setTimeout(() => (showDropdown = false), 200)}
		/>

		{#if showDropdown && searchQuery.length > 0 && filtered.length > 0}
			<div
				class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto"
			>
				{#each filtered as ann}
					<button
						class="w-full text-left px-3 py-2 hover:bg-primary-50 transition-colors text-sm border-b border-gray-50 last:border-0"
						onmousedown={(e) => {
							e.preventDefault();
							addRef(ann);
						}}
					>
						<span class="text-gray-800 truncate block"
							>"{ann.anchorText}"</span
						>
						<span class="text-[11px] text-gray-500"
							>{ann.authors.join(", ")}</span
						>
					</button>
				{/each}
			</div>
		{/if}

		{#if showDropdown && searchQuery.length > 0 && filtered.length === 0}
			<div
				class="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3"
			>
				<p class="text-xs text-gray-500 text-center">
					No matching annotations found
				</p>
			</div>
		{/if}
	</div>
</div>
