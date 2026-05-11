<script lang="ts">
	let { children, textMetadata } = $props<{
		children: any[];
		textMetadata: any;
	}>();
</script>

<div class="max-w-2xl mt-12">
	<h2 class="text-xl font-bold font-serif text-gray-900 mb-6 flex items-center gap-3">
		Table of Contents
		<div class="flex-1 h-px bg-gray-200"></div>
	</h2>
	{#if children.length === 0}
		<div class="text-center py-12 border-2 text-gray-400 border-dashed border-gray-200 rounded-xl bg-surface-card/50">
			This collection is empty.
		</div>
	{:else}
		<div class="space-y-4">
			{#each children as child, i}
				<a
					href={`/texts/${child.id}`}
					class="block bg-surface-card hover:bg-surface-elevated rounded-xl border border-gray-100 shadow-sm p-5 transition-colors group"
				>
					<div class="flex items-center gap-4">
						<div class="w-10 h-10 shrink-0 rounded-lg bg-gray-50 flex items-center justify-center font-serif text-gray-400 font-semibold border border-gray-100/50">
							{child.order || i + 1}
						</div>
						<div class="flex-1">
							<h3 class="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
								{child.title}
							</h3>
							{#if child.author !== textMetadata.author}
								<p class="text-sm text-gray-500 mt-1">
									{child.author}
								</p>
							{/if}
						</div>
						<div class="text-gray-300 group-hover:text-primary-500 transition-colors">
							<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
							</svg>
						</div>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
