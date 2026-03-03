<script lang="ts">
	import type { PageData } from "./$types";
	import TextForm from "$lib/components/admin/TextForm.svelte";
	let { data } = $props();

	const typeOrder = ["poetry", "prose", "drama"] as const;
	const typeLabel: Record<string, string> = {
		poetry: "Poetry",
		prose: "Prose",
		drama: "Drama",
	};

	// Group texts: type → category → texts
	const groupedTexts = $derived.by(() => {
		const result: {
			type: string;
			categories: { name: string; texts: any[] }[];
		}[] = [];
		for (const type of typeOrder) {
			const textsOfType = data.texts.filter((t: any) => t.type === type);
			if (textsOfType.length === 0) continue;
			const catMap: Record<string, any[]> = {};
			for (const t of textsOfType) {
				const cat = t.category || "Uncategorized";
				if (!catMap[cat]) catMap[cat] = [];
				catMap[cat].push(t);
			}
			const categories = Object.entries(catMap)
				.sort((a, b) => a[0].localeCompare(b[0]))
				.map(([name, texts]) => ({ name, texts }));
			result.push({ type, categories });
		}
		return result;
	});

	async function deleteText(textId: string, title: string) {
		if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
		try {
			const res = await fetch(`/api/texts/${textId}`, {
				method: "DELETE",
			});
			if (res.ok) {
				window.location.reload();
			} else {
				alert("Failed to delete text");
			}
		} catch {
			alert("Failed to delete text");
		}
	}
</script>

<svelte:head>
	<title>Manage Texts — TEASys Viewer</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<div class="mb-8">
		<a
			href="/admin"
			class="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-primary-600 transition-colors mb-4"
		>
			← Admin
		</a>
		<h1 class="text-2xl font-bold text-gray-900">Manage Texts</h1>
	</div>

	<div class="mb-8">
		<TextForm
			existingCategories={[
				...new Set(
					data.texts.map((t: any) => t.category).filter(Boolean),
				),
			]}
		/>
	</div>

	{#if data.texts.length > 0}
		{#each groupedTexts as group}
			<div class="mb-6">
				<h2
					class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2"
				>
					{typeLabel[group.type]}
				</h2>
				{#each group.categories as cat}
					<div class="mb-4 last:mb-0">
						<p
							class="text-[10px] font-medium text-gray-300 uppercase tracking-wider mb-1 pl-4"
						>
							{cat.name}
						</p>
						<div
							class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
						>
							{#each cat.texts as text, i}
								<div
									class="flex items-center justify-between p-4 {i >
									0
										? 'border-t border-gray-50'
										: ''} hover:bg-gray-50/50 transition-colors"
								>
									<div class="min-w-0 flex-1">
										<p
											class="font-semibold text-sm text-gray-900"
										>
											{text.title}
										</p>
										<p class="text-xs text-gray-500 mt-0.5">
											{text.author}{#if text.year}<span
													class="text-gray-300 mx-1"
													>·</span
												>{text.year}{/if}
										</p>
									</div>
									<div class="flex items-center gap-3 ml-4">
										<a
											href={`/texts/${text.id}`}
											class="text-xs font-medium text-primary-600 hover:text-primary-700 px-2.5 py-1 rounded-md hover:bg-primary-50 transition-colors"
										>
											View
										</a>
										<button
											onclick={() =>
												deleteText(text.id, text.title)}
											class="text-xs font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
										>
											Delete
										</button>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/each}
	{:else}
		<div
			class="text-center py-12 bg-white rounded-xl border border-gray-100"
		>
			<p class="text-sm text-gray-500">
				No texts yet. Use the form above to add one.
			</p>
		</div>
	{/if}
</div>
