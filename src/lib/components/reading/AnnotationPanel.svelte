<script lang="ts">
	import type { Annotation } from "$lib/types/annotation";
	import AnnotationEntry from "./AnnotationEntry.svelte";
	import { slide } from "svelte/transition";

	let {
		annotation,
		user,
		textId,
		onClose,
	}: {
		annotation: Annotation | null;
		user: { username: string; role: string } | null;
		textId: string;
		onClose: () => void;
	} = $props();
</script>

{#if annotation}
	<div
		class="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
		onclick={onClose}
		onkeydown={(e) => e.key === "Escape" && onClose()}
		role="button"
		tabindex="0"
	></div>
	<aside
		transition:slide={{ duration: 250, axis: "x" }}
		class="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-40 overflow-y-auto
		       border-l border-gray-100"
	>
		<!-- Header -->
		<div
			class="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4 flex items-center justify-between"
		>
			<div class="flex items-center gap-3">
				<h2 class="text-lg font-semibold text-gray-900">
					{annotation.title}
				</h2>
			</div>
			<div class="flex items-center gap-3">
				{#if user}
					<a
						href={`/texts/${textId}/annotate?annotationId=${annotation.id}`}
						class="text-xs font-medium text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg
						       bg-primary-50 hover:bg-primary-100 transition-colors"
					>
						Edit
					</a>
				{/if}
				<button
					onclick={onClose}
					class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400
					       hover:text-gray-600 hover:bg-gray-100 transition-colors"
				>
					&times;
				</button>
			</div>
		</div>

		<!-- Content -->
		<div class="p-6">
			<AnnotationEntry {annotation} />
		</div>
	</aside>
{/if}
