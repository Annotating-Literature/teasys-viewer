<script lang="ts">
	import { untrack } from "svelte";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";

	let { data } = $props();

	let saving = $state(false);
	let errorMsg = $state<string | null>(null);

	let title = $state(untrack(() => data.text.metadata.title));
	let author = $state(untrack(() => data.text.metadata.author));
	let year = $state(untrack(() => data.text.metadata.year || ""));
	let category = $state(untrack(() => data.text.metadata.category));
	let rawText = $state(untrack(() => data.text.rawText));

	const canEditContent = $derived(data.annotationCount === 0);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		saving = true;
		errorMsg = null;

		try {
			const payload: any = {
				metadata: {
					title,
					author,
					year: year ? parseInt(year.toString(), 10) : null,
					category,
					type: data.text.metadata.type,
					parentId: data.text.metadata.parentId,
					order: data.text.metadata.order
				},
			};

			if (canEditContent) {
				payload.rawText = rawText;
			}

			const res = await fetch(`/api/texts/${data.text.metadata.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			if (!res.ok) {
				const body = await res.json().catch(() => ({})) as any;
				throw new Error(body.error || "Failed to update text");
			}

			window.location.href = "/admin/texts";
		} catch (err) {
			errorMsg = err instanceof Error ? err.message : "Failed to update";
		} finally {
			saving = false;
		}
	}
</script>

<svelte:head>
	<title>Edit {data.text.metadata.title} — TEASys Viewer</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<div class="mb-8">
		<Breadcrumbs
			crumbs={[
				{ label: "Library", href: "/" },
				{ label: "Admin", href: "/admin" },
				{ label: "Texts", href: "/admin/texts" },
				{ label: "Edit Text" },
			]}
		/>
		<h1 class="text-2xl font-bold text-gray-900 mt-2">Edit Text</h1>
	</div>

	<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
		{#if errorMsg}
			<div class="mb-4 bg-red-50 text-red-600 text-m rounded-lg px-3 py-2">
				{errorMsg}
			</div>
		{/if}
		<form onsubmit={handleSubmit}>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<div>
					<label for="title" class="block text-[13px] font-medium text-gray-600 mb-1">Title *</label>
					<input id="title" type="text" required bind:value={title} class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500" />
				</div>
				<div>
					<label for="author" class="block text-[13px] font-medium text-gray-600 mb-1">Author *</label>
					<input id="author" type="text" required bind:value={author} class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500" />
				</div>
				<div>
					<label for="year" class="block text-[13px] font-medium text-gray-600 mb-1">Year</label>
					<input id="year" type="number" bind:value={year} class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500" />
				</div>
				<div>
					<label for="category" class="block text-[13px] font-medium text-gray-600 mb-1">Category *</label>
					<input id="category" type="text" required bind:value={category} class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500" />
				</div>
			</div>

			{#if data.text.metadata.type !== "collection"}
				<div class="mb-4 mt-6 border-t border-gray-100 pt-6">
					<label for="rawText" class="flex justify-between items-end mb-1">
						<span class="block text-[13px] font-medium text-gray-600">Text Content</span>
						{#if !canEditContent}
							<span class="text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">Read-only ({data.annotationCount} annotations)</span>
						{/if}
					</label>
					{#if !canEditContent}
						<div class="mb-2 text-[13px] text-gray-500">
							This text has existing annotations. Editing the raw content could offset and corrupt these annotations. Delete all annotations first to enable editing.
						</div>
					{/if}
					<textarea
						id="rawText"
						required
						rows="12"
						bind:value={rawText}
						disabled={!canEditContent}
						class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500 font-mono disabled:bg-gray-50 disabled:text-gray-500"
					></textarea>
				</div>
			{/if}

			<div class="mt-6 flex gap-3 justify-end">
				<a
					href="/admin/texts"
					class="px-4 py-2 text-m font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
				>
					Cancel
				</a>
				<button
					type="submit"
					disabled={saving}
					class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
				>
					{saving ? "Saving..." : "Save Changes"}
				</button>
			</div>
		</form>
	</div>
</div>