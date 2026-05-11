<script lang="ts">
	let { totalAnnotations, stats } = $props<{
		totalAnnotations: number;
		stats: any;
	}>();
</script>

{#if totalAnnotations > 0}
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
		<!-- Annotation depth -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
			<h3 class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
				Annotation Depth
			</h3>
			<div class="space-y-2.5">
				{#each [1, 2, 3] as level}
					{@const count = stats.levelCounts[level] || 0}
					{@const pct = totalAnnotations > 0 ? Math.round((count / Math.max(stats.levelCounts[1] + stats.levelCounts[2] + stats.levelCounts[3], 1)) * 100) : 0}
					<div>
						<div class="flex items-center justify-between text[13px] mb-1">
							<span class="text-gray-600">Level {level}</span>
							<span class="text-gray-500">{count}</span>
						</div>
						<div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
							<div class="h-full rounded-full transition-all duration-500" class:bg-primary-300={level === 1} class:bg-primary-500={level === 2} class:bg-primary-700={level === 3} style="width: {pct}%"></div>
						</div>
					</div>
				{/each}
			</div>
			<div class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text[13px] text-gray-500">
				<span>Avg per text</span>
				<span class="font-semibold text-gray-700">{stats.avgAnnotations}</span>
			</div>
		</div>

		<!-- Category breakdown -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
			<h3 class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3">
				Categories
			</h3>
			<div class="space-y-2">
				{#each stats.categoryCounts as [cat, count]}
					{@const total = stats.categoryCounts.reduce((s: number, [, c]: [any, number]) => s + c, 0)}
					{@const pct = Math.round((count / Math.max(total, 1)) * 100)}
					<div class="flex items-center gap-2.5">
						<span class="text[13px] text-gray-600 w-28 truncate capitalize">{cat.replace(/-/g, " ")}</span>
						<div class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
							<div class="h-full bg-primary-400 rounded-full" style="width: {pct}%"></div>
						</div>
						<span class="text-[11px] text-gray-500 w-6 text-right">{count}</span>
					</div>
				{/each}
			</div>
		</div>

		<!-- Highlights -->
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
			<h3 class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
				Highlights
			</h3>

			{#if stats.mostAnnotated}
				<div>
					<p class="text-[11px] text-gray-500 uppercase tracking-wider">Most Annotated</p>
					<a href={`/texts/${stats.mostAnnotated.id}`} class="text-m font-medium text-gray-800 hover:text-primary-600 transition-colors line-clamp-1">
						{stats.mostAnnotated.title}
					</a>
					<p class="text-[11px] text-gray-500">{stats.mostAnnotated.count} annotations</p>
				</div>
			{/if}

			<div class="flex gap-4">
				<div>
					<p class="text-[11px] text-gray-500 uppercase tracking-wider">Contributors</p>
					<p class="text-lg font-bold text-gray-900">{stats.contributors}</p>
				</div>
				<div>
					<p class="text-[11px] text-gray-500 uppercase tracking-wider">Cross-refs</p>
					<p class="text-lg font-bold text-gray-900">{stats.totalCrossRefs}</p>
				</div>
				<div>
					<p class="text-[11px] text-gray-500 uppercase tracking-wider">Citations</p>
					<p class="text-lg font-bold text-gray-900">{stats.totalWorksCited}</p>
				</div>
			</div>

			{#if stats.mostRecent}
				<div class="pt-2 border-t border-gray-50">
					<p class="text-[11px] text-gray-500 uppercase tracking-wider">Last Activity</p>
					<p class="text[13px] text-gray-600 mt-0.5 line-clamp-1">"{stats.mostRecent.anchorText}"</p>
					<p class="text-[11px] text-gray-500">
						by {stats.mostRecent.authors.join(", ")} · {new Date(stats.mostRecent.updatedAt).toLocaleDateString()}
					</p>
				</div>
			{/if}
		</div>
	</div>
{/if}
