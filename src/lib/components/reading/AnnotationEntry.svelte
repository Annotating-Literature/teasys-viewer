<script lang="ts">
	import type { Annotation, AnnotationLevel } from "$lib/types/annotation";
	import CategoryBadge from "./CategoryBadge.svelte";
	import { marked } from "marked";

	let {
		annotation,
		allAnnotations = [],
		onCrossRefClick,
	}: {
		annotation: Annotation;
		allAnnotations?: Annotation[];
		onCrossRefClick?: (annotationId: string) => void;
	} = $props();

	// Apply smart quotes to text nodes only — skips content inside HTML tags
	function applySmartQuotes(html: string): string {
		const unescaped = html.replace(/&quot;/g, '"');
		let insideTag = false;
		let open = true;
		let result = "";
		for (const ch of unescaped) {
			if (ch === "<") {
				insideTag = true;
				result += ch;
			} else if (ch === ">") {
				insideTag = false;
				result += ch;
			} else if (ch === '"' && !insideTag) {
				result += open ? "\u201c" : "\u201d";
				open = !open;
			} else {
				result += ch;
			}
		}
		return result;
	}

	function renderBody(body: string): string {
		const resolved = body.replace(/\[\[([^\]]+)\]\]/g, (match, annId) => {
			const ref = allAnnotations.find((a) => a.id === annId);
			if (ref) {
				return `<a class="crossref-link" data-ann-id="${annId}" title="Cross-reference: ${ref.anchorText}">\u201c${ref.anchorText}\u201d</a>`;
			}
			return match;
		});
		return applySmartQuotes(marked(resolved) as string);
	}

	function renderWorkCited(work: string): string {
		// Escape HTML special chars
		let result = work
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;");
		// Smart quotes
		let quoteOpen = true;
		result = result.replace(/"/g, () => {
			const q = quoteOpen ? "\u201c" : "\u201d";
			quoteOpen = !quoteOpen;
			return q;
		});
		// Markdown italics: *text* and _text_
		result = result
			.replace(/\*([^*]+)\*/g, "<em>$1</em>")
			.replace(/_([^_]+)_/g, "<em>$1</em>");
		return result;

		// Markdown bold: **text** and __text__
		result = result
			.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
			.replace(/__([^_]+)__/g, "<strong>$1</strong>");
		return result;
	}

	function handleBodyClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (target.classList.contains("crossref-link") && onCrossRefClick) {
			const annId = target.getAttribute("data-ann-id");
			if (annId) {
				e.preventDefault();
				onCrossRefClick(annId);
			}
		}
	}
</script>

<div>
	<!-- Anchor quote -->
	<div
		class="mb-4 bg-gray-50 rounded-lg p-3 border-l-[3px] border-primary-200"
	>
		<p
			class="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider"
		>
			Passage
		</p>
		<p class="text-sm text-gray-700 leading-relaxed">
			“{annotation.anchorText}”
		</p>
	</div>

	<!-- Author -->
	<div class="mb-4 text-xs text-gray-400">
		<span
			>by <strong class="text-gray-600 font-medium"
				>{annotation.authors.join(", ")}</strong
			></span
		>
	</div>

	<!-- Levels -->
	{#each annotation.levels as level, i (i)}
		<div class="mb-5 last:mb-0">
			<div class="flex items-center gap-2 mb-2">
				<span
					class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500"
				>
					{level.level}
				</span>
				<CategoryBadge category={level.category} />
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="prose prose-sm max-w-none text-gray-700 leading-relaxed prose-p:text-gray-700 prose-strong:text-gray-800 prose-a:text-primary-600"
				onclick={handleBodyClick}
			>
				{@html renderBody(level.body)}
			</div>
			{#if level.worksCited.length > 0}
				<div class="mt-3 pt-3 border-t border-gray-100">
					<h5
						class="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5"
					>
						Works Cited
					</h5>
					<ul class="text-xs text-gray-500 space-y-1">
						{#each level.worksCited as work}
							<li
								class="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-gray-300"
							>
								{@html renderWorkCited(work)}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
		{#if i < annotation.levels.length - 1}
			<hr class="border-gray-100 mb-5" />
		{/if}
	{/each}
</div>

<style>
	:global(.crossref-link) {
		color: var(--color-primary-600);
		font-weight: 500;
		cursor: pointer;
		text-decoration: underline;
		text-decoration-color: var(--color-primary-300);
		text-underline-offset: 2px;
	}
	:global(.crossref-link:hover) {
		text-decoration-color: var(--color-primary-600);
	}
</style>
