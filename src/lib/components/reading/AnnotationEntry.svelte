<script lang="ts">
	import type { Annotation, AnnotationLevel } from "$lib/types/annotation";
	import CategoryBadge from "./CategoryBadge.svelte";
	import { marked } from "marked";
	import DOMPurify from "isomorphic-dompurify";

	let {
		annotation,
		allAnnotations = [],
		onCrossRefClick,
	}: {
		annotation: Annotation;
		allAnnotations?: Annotation[];
		onCrossRefClick?: (annotationId: string) => void;
	} = $props();

	// Find annotations that are strictly enclosed by this one
	const enclosedAnnotations = $derived(
		allAnnotations.filter((a) => {
			if (a.id === annotation.id) return false;
			// Strict subphrase: inside bounds, and at least one bound is strictly smaller
			return (
				a.anchorStart >= annotation.anchorStart &&
				a.anchorEnd <= annotation.anchorEnd &&
				(a.anchorStart > annotation.anchorStart ||
					a.anchorEnd < annotation.anchorEnd)
			);
		}),
	);

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
		const html = applySmartQuotes(marked(resolved) as string);
		return DOMPurify.sanitize(html, { ADD_ATTR: ["data-ann-id"] });
	}

	function renderWorkCited(work: string): string {
		// 1. Strip out any pre-existing HTML tags that might have been saved in the DB to avoid double-escaping
		const strippedWork = work.replace(/<[^>]*>?/gm, "");

		// 2. Wrap plain DOIs in markdown link syntax before parsing
		let mdWork = strippedWork;
		const doiRegex =
			/(?:https?:\/\/)?(?:doi\.org\/|doi:\s*)(10\.\d{4,9}\/[-\._;()\/:A-Z0-9]+)/gi;
		mdWork = mdWork.replace(doiRegex, (match, p1) => {
			return `[doi.org/${p1}](https://doi.org/${p1})`;
		});

		// 3. Parse with marked
		let html = marked(mdWork) as string;

		// 4. Clean up paragraph tags that marked wraps around everything
		html = html.replace(/^<p>/, "").replace(/<\/p>\n?$/, "");

		// 5. Add our Tailwind classes and target="_blank" to ALL links
		html = html.replace(
			/<a([^>]*)>/g,
			'<a$1 target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline hover:underline-offset-2 transition-all">',
		);

		// 6. Apply strictly safe smart quotes (skipping HTML tags)
		html = applySmartQuotes(html);

		return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
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
			class="text[13px] text-gray-500 font-medium mb-1 uppercase tracking-wider"
		>
			Passage
		</p>
		<p class="text-m text-gray-700 leading-relaxed">
			“{annotation.anchorText}”
		</p>
	</div>

	<!-- Author -->
	<div class="mb-4 text[13px] text-gray-500">
		<span
			>by <strong class="text-gray-600 font-medium"
				>{annotation.authors.join(", ")}</strong
			></span
		>
	</div>

	{#if enclosedAnnotations.length > 0}
		<div class="mb-6 pb-5 border-b border-gray-100">
			<h4
				class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3"
			>
				Subphrase Annotations
			</h4>
			<div class="space-y-3">
				{#each enclosedAnnotations as enc}
					<button
						class="w-full text-left p-3 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all group"
						onclick={(e) => {
							e.stopPropagation();
							if (onCrossRefClick) onCrossRefClick(enc.id);
						}}
					>
						<p
							class="text-[13px] text-gray-800 font-serif line-clamp-2 leading-relaxed mb-1.5"
						>
							“{enc.anchorText}”
						</p>
						<div class="flex items-center gap-1.5">
							<span
								class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
							>
								{enc.levels[0].category}
							</span>
							<span class="text-[10px] text-gray-300">·</span>
							<span class="text-[10px] text-gray-400">
								{enc.authors.join(", ")}
							</span>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Levels -->
	{#each annotation.levels as level, i (i)}
		<div class="mb-5 last:mb-0">
			<div class="flex items-center gap-2 mb-2">
				<span
					class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-[11px] font-bold text-gray-500"
				>
					{level.level}
				</span>
				<CategoryBadge category={level.category} />
			</div>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="prose max-w-none text-[13px] text-gray-700 leading-relaxed prose-p:text-[13px] prose-p:text-gray-700 prose-strong:text-gray-800 prose-a:text-primary-600 prose-li:text-[13px]"
				onclick={handleBodyClick}
			>
				{@html renderBody(level.body)}
			</div>
			{#if level.worksCited.length > 0}
				<div class="mt-3 pt-3 border-t border-gray-100">
					<h5
						class="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5"
					>
						Works Cited
					</h5>
					<ul class="text-[13px] text-gray-500 space-y-1">
						{#each level.worksCited as work}
							<li
								class="pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-gray-500"
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
