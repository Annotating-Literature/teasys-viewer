<script lang="ts">
	let { groups, title } = $props<{
		groups: [string, any[]][];
		title: string;
	}>();
</script>

{#if groups.length > 0}
	<div class="mb-8">
		<h2 class="text-m font-semibold text-gray-900 mb-3">{title}</h2>
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			{#each groups as [groupName, groupTexts], i}
				<div class="p-4 {i > 0 ? 'border-t border-gray-50' : ''}">
					<div class="flex items-center justify-between mb-2">
						<h3 class="text-m font-medium text-gray-800">{groupName}</h3>
						<span class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
							{groupTexts.length} text{groupTexts.length !== 1 ? "s" : ""}
						</span>
					</div>
					<div class="flex flex-wrap gap-2">
						{#each groupTexts as t}
							<a href={`/texts/${t.id}`} class="inline-flex items-center gap-1.5 px-2.5 py-1 text[13px] bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors">
								<span class="text-[11px] text-gray-500 font-medium">{t.type}</span>
								<span class="font-medium">{t.title}</span>
								{#if t.annotations.length > 0}
									<span class="text-gray-500">· {t.annotations.length} ann.</span>
								{/if}
							</a>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
