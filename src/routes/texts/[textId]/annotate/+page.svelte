<script lang="ts">
	import type { PageData } from "./$types";
	import type { Annotation } from "$lib/types/annotation";
	import { v4 as uuidv4 } from "uuid";
	import AnnotatedText from "$lib/components/reading/AnnotatedText.svelte";
	import AnnotationForm from "$lib/components/editor/AnnotationForm.svelte";
	import TextSelector from "$lib/components/editor/TextSelector.svelte";

	let { data } = $props();
	let selectedAnnotation = $state<Annotation | null>(null);
	let newAnnotationAnchor = $state<{
		text: string;
		start: number;
		end: number;
	} | null>(null);
	let saving = $state(false);
	let error = $state<string | null>(null);

	const formAnnotation = $derived.by<Annotation | null>(() => {
		if (selectedAnnotation) return selectedAnnotation;
		if (newAnnotationAnchor) {
			return {
				id: "",
				anchorText: newAnnotationAnchor.text,
				anchorStart: newAnnotationAnchor.start,
				anchorEnd: newAnnotationAnchor.end,
				authors: [data.user.username],
				version: 1,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				levels: [
					{
						level: 1 as const,
						category: "language" as const,
						body: "",
						worksCited: [],
					},
				],
				crossRefs: [],
			};
		}
		return null;
	});

	async function handleSave(annotation: Annotation) {
		saving = true;
		error = null;
		try {
			const isNew = !annotation.id;
			const toSave = {
				...annotation,
				id: isNew ? uuidv4() : annotation.id,
				version: isNew ? 1 : annotation.version,
				updatedAt: new Date().toISOString(),
			};

			const method = isNew ? "POST" : "PUT";
			const url = isNew
				? `/api/texts/${data.text.metadata.id}/annotations`
				: `/api/texts/${data.text.metadata.id}/annotations/${annotation.id}`;

			const res = await fetch(url, {
				method,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(toSave),
			});

			if (!res.ok) {
				const body = await res
					.json()
					.catch(() => ({ error: "Unknown error" }));
				throw new Error(body.error || "Failed to save");
			}

			window.location.reload();
		} catch (e) {
			error = e instanceof Error ? e.message : "Save failed";
			console.error("Save failed:", e);
		} finally {
			saving = false;
		}
	}

	async function handleDelete(annotationId: string) {
		if (!confirm("Delete this annotation?")) return;
		try {
			const res = await fetch(
				`/api/texts/${data.text.metadata.id}/annotations/${annotationId}`,
				{
					method: "DELETE",
				},
			);
			if (!res.ok) throw new Error("Failed to delete");
			window.location.reload();
		} catch (e) {
			error = e instanceof Error ? e.message : "Delete failed";
		}
	}

	function handleCancel() {
		selectedAnnotation = null;
		newAnnotationAnchor = null;
		error = null;
	}

	function handleTextSelect(sel: {
		text: string;
		start: number;
		end: number;
	}) {
		selectedAnnotation = null;
		newAnnotationAnchor = sel;
	}
</script>

<svelte:head>
	<title>Annotate: {data.text.metadata.title} — TEASys Viewer</title>
</svelte:head>

<div class="flex" style="height: calc(100vh - 4rem);">
	<!-- Left sidebar: annotation list + form -->
	<div
		class="w-[400px] shrink-0 overflow-y-auto border-r border-gray-200 bg-white flex flex-col"
	>
		{#if formAnnotation}
			<!-- Annotation form -->
			<div class="p-4 border-b border-gray-100 bg-gray-50">
				<div class="flex items-center justify-between mb-2">
					<h2 class="font-semibold text-sm text-gray-900">
						{selectedAnnotation
							? "Edit Annotation"
							: "New Annotation"}
					</h2>
					<button
						onclick={handleCancel}
						class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
					>
						Cancel
					</button>
				</div>
				<div
					class="bg-primary-50 rounded-lg p-3 border-l-4 border-primary-300"
				>
					<p class="text-xs text-gray-500 mb-0.5">Annotating:</p>
					<p class="text-sm text-gray-700">
						“{formAnnotation.anchorText}”
					</p>
				</div>
			</div>
			<div class="flex-1 overflow-y-auto p-4">
				{#if error}
					<div
						class="mb-4 bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2"
					>
						{error}
					</div>
				{/if}
				<AnnotationForm
					annotation={formAnnotation}
					availableAnnotations={data.annotations.filter(
						(a) => a.id !== formAnnotation.id,
					)}
					onSave={handleSave}
					onDelete={selectedAnnotation ? handleDelete : undefined}
					onCancel={handleCancel}
				/>
			</div>
		{:else}
			<!-- Annotation list -->
			<div class="p-4 border-b border-gray-100">
				<h2 class="font-semibold text-sm text-gray-900">Annotations</h2>
				<p class="text-xs text-gray-400 mt-0.5">
					Select text in the reading area to annotate
				</p>
			</div>
			<div class="flex-1 overflow-y-auto p-4">
				{#if data.annotations.length === 0}
					<div class="text-center py-8">
						<div
							class="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center"
						>
							<span class="text-gray-400">—</span>
						</div>
						<p class="text-sm text-gray-500">No annotations yet</p>
						<p class="text-xs text-gray-400 mt-1">
							Highlight text to create one
						</p>
					</div>
				{:else}
					{#each data.annotations as ann}
						<button
							class="w-full text-left p-3 rounded-lg mb-2 transition-all border hover:border-primary-200 hover:bg-primary-50/50"
							class:border-primary-300={selectedAnnotation?.id ===
								ann.id}
							class:bg-primary-50={selectedAnnotation?.id ===
								ann.id}
							class:border-transparent={selectedAnnotation?.id !==
								ann.id}
							onclick={() => {
								selectedAnnotation = ann;
								newAnnotationAnchor = null;
							}}
						>
							<p class="text-sm text-gray-800 line-clamp-1">
								“{ann.anchorText}”
							</p>
							<p class="text-[10px] text-gray-400 mt-0.5">
								by {ann.authors.join(", ")}
							</p>
						</button>
					{/each}
				{/if}
			</div>
		{/if}
	</div>

	<!-- Right: reading area with text selection -->
	<div class="flex-1 overflow-y-auto p-8 bg-surface">
		<div class="max-w-3xl mx-auto">
			<div class="mb-6">
				<a
					href={`/texts/${data.text.metadata.id}`}
					class="text-sm text-gray-400 hover:text-primary-600 transition-colors"
				>
					← Back to reading view
				</a>
				<h1 class="text-2xl font-bold text-gray-900 mt-2">
					{data.text.metadata.title}
				</h1>
				<p class="text-sm text-gray-500 mt-1">
					{data.text.metadata.author}
				</p>
			</div>

			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-8"
			>
				<TextSelector onSelect={handleTextSelect}>
					<AnnotatedText
						rawText={data.text.rawText}
						parsedText={data.parsedText}
						annotations={data.annotations}
						activeAnnotationId={selectedAnnotation?.id ?? null}
					/>
				</TextSelector>
			</div>
		</div>
	</div>
</div>
