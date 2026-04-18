<script lang="ts">
	import { marked } from "marked";
	import { applySmartQuotes } from "$lib/utils/html";
	import type { Annotation } from "$lib/types/annotation";

	type Props = {
		id: string;
		value?: string;
		placeholder?: string;
		availableAnnotations?: Annotation[];
	};
	let {
		id,
		value = $bindable(),
		placeholder = "Write your annotation here (Markdown supported)...",
		availableAnnotations = [],
	} = $props();

	let showPreview = $state(false);
	let showPicker = $state(false);
	let pickerQuery = $state("");
	let pickerIndex = $state(0);
	let textareaEl = $state<HTMLTextAreaElement | null>(null);
	let bracketStart = $state(-1);

	const filteredAnnotations = $derived(
		availableAnnotations
			.filter(
				(ann) =>
					ann.anchorText
						.toLowerCase()
						.includes(pickerQuery.toLowerCase()) ||
					ann.authors.some((a: string) =>
						a.toLowerCase().includes(pickerQuery.toLowerCase()),
					),
			)
			.slice(0, 8),
	);

	function handleInput() {
		if (!textareaEl) return;
		const pos = textareaEl.selectionStart;
		const text = textareaEl.value;

		// Check if we just typed `[[`
		if (pos >= 2 && text.substring(pos - 2, pos) === "[[") {
			bracketStart = pos - 2;
			pickerQuery = "";
			pickerIndex = 0;
			showPicker = true;
			return;
		}

		// If picker is open, update the search query
		if (showPicker && bracketStart >= 0) {
			const queryText = text.substring(bracketStart + 2, pos);
			// Close picker if user typed `]]` or deleted back past `[[`
			if (queryText.includes("]]") || pos <= bracketStart + 1) {
				showPicker = false;
				return;
			}
			pickerQuery = queryText;
			pickerIndex = 0;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!showPicker) return;

		if (e.key === "ArrowDown") {
			e.preventDefault();
			pickerIndex = Math.min(
				pickerIndex + 1,
				filteredAnnotations.length - 1,
			);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			pickerIndex = Math.max(pickerIndex - 1, 0);
		} else if (e.key === "Enter" || e.key === "Tab") {
			if (filteredAnnotations.length > 0) {
				e.preventDefault();
				insertAnnotation(filteredAnnotations[pickerIndex]);
			}
		} else if (e.key === "Escape") {
			e.preventDefault();
			showPicker = false;
		}
	}

	function insertAnnotation(ann: Annotation) {
		if (!textareaEl) return;
		const pos = textareaEl.selectionStart;
		const text = textareaEl.value;
		// Replace from `[[query` with `[[ann-id]]`
		const before = text.substring(0, bracketStart);
		const after = text.substring(pos);
		value = before + `[[${ann.id}]]` + after;
		showPicker = false;

		// Move cursor after the `]]`
		const newPos = before.length + ann.id.length + 4; // [[ + id + ]]
		requestAnimationFrame(() => {
			if (textareaEl) {
				textareaEl.selectionStart = newPos;
				textareaEl.selectionEnd = newPos;
				textareaEl.focus();
			}
		});
	}

	// Render preview with cross-ref links resolved
	function renderPreview(text: string): string {
		// Replace [[ann-id]] with anchor text links
		const resolved = text.replace(/\[\[([^\]]+)\]\]/g, (match, annId) => {
			const ann = availableAnnotations.find((a) => a.id === annId);
			if (ann) {
				return `<a class="crossref-link" data-ann-id="${annId}" title="Cross-reference">“${ann.anchorText}”</a>`;
			}
			return match;
		});
		const html = applySmartQuotes(marked(resolved) as string);
		return html;
	}

	function applyMarkdownFormat(formatText: string, cursorOffset: number) {
		if (!textareaEl) return;
		const s = textareaEl.selectionStart;
		const e = textareaEl.selectionEnd;
		const currentVal = value || "";

		if (s === e) return; // Only process if text is selected

		const before = currentVal.substring(0, s);
		const selected = currentVal.substring(s, e);
		const after = currentVal.substring(e);

		value = before + formatText + selected + formatText + after;

		requestAnimationFrame(() => {
			if (textareaEl) {
				textareaEl.focus();
				textareaEl.setSelectionRange(
					s + cursorOffset,
					e + cursorOffset,
				);
			}
		});
	}
</script>

<div class="border border-gray-200 rounded-lg relative">
	<div class="flex border-b border-gray-100 bg-gray-50 rounded-t-lg">
		<button
			class="px-3 py-1.5 text-[11px] font-medium transition-colors rounded-tl-lg"
			class:text-primary-600={!showPreview}
			class:bg-white={!showPreview}
			class:text-gray-500={showPreview}
			class:bg-gray-50={showPreview}
			onclick={() => (showPreview = false)}
		>
			Write
		</button>
		<button
			class="px-3 py-1.5 text-[11px] font-medium transition-colors"
			class:text-primary-600={showPreview}
			class:bg-white={showPreview}
			class:text-gray-500={!showPreview}
			class:bg-gray-50={!showPreview}
			onclick={() => (showPreview = true)}
		>
			Preview
		</button>
		{#if availableAnnotations.length > 0 && !showPreview}
			<span
				class="ml-auto px-3 py-1.5 text-[11px] text-gray-500 flex items-center gap-2"
			>
				<div
					class="flex items-center gap-1 border-r border-gray-200 pr-2 mr-1"
				>
					<button
						type="button"
						class="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-sans font-bold text[13px]"
						title="Bold (select text first)"
						onclick={() => applyMarkdownFormat("**", 2)}
					>
						B
					</button>
					<button
						type="button"
						class="w-6 h-6 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 font-serif italic font-bold text[13px]"
						title="Italic (select text first)"
						onclick={() => applyMarkdownFormat("*", 1)}
					>
						I
					</button>
				</div>
				<span>
					Type <kbd
						class="px-1 py-0.5 bg-gray-200 rounded text-[9px] font-mono"
						>[[</kbd
					> to cross-reference
				</span>
			</span>
		{/if}
	</div>
	{#if showPreview}
		<div
			class="prose prose-sm max-w-none p-3 min-h-[120px] text-m bg-white rounded-b-lg"
		>
			{@html renderPreview(value || "*No content yet*")}
		</div>
	{:else}
		<div class="relative">
			<textarea
				{id}
				class="w-full h-32 p-3 text-m focus:outline-none placeholder:text-gray-500 resize-y bg-transparent rounded-b-lg"
				{placeholder}
				bind:value
				bind:this={textareaEl}
				oninput={handleInput}
				onkeydown={handleKeydown}
			></textarea>

			{#if showPicker && filteredAnnotations.length > 0}
				<div
					class="absolute z-30 left-3 right-3 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto"
					style="top: 100%;"
				>
					<div
						class="px-3 py-1.5 border-b border-gray-100 bg-gray-50 rounded-t-lg sticky top-0"
					>
						<span
							class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider"
							>Insert cross-reference</span
						>
					</div>
					{#each filteredAnnotations as ann, i}
						<button
							class="w-full text-left px-3 py-2 text-m transition-colors border-b border-gray-50 last:border-0"
							class:bg-primary-50={i === pickerIndex}
							class:hover:bg-gray-50={i !== pickerIndex}
							onmousedown={(e) => {
								e.preventDefault();
								insertAnnotation(ann);
							}}
							onmouseenter={() => (pickerIndex = i)}
						>
							<span class="text-gray-700 block truncate"
								>"{ann.anchorText}"</span
							>
							<span class="text-[11px] text-gray-500"
								>{ann.authors.join(", ")}</span
							>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
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
