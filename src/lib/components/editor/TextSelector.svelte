<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import type { Snippet } from "svelte";

	type Props = {
		onSelect: (selection: {
			text: string;
			start: number;
			end: number;
		}) => void;
		children: Snippet;
	};
	let { onSelect, children } = $props();

	let buttonPos = $state<{ top: number; left: number } | null>(null);
	let pendingSelection = $state<{
		text: string;
		start: number;
		end: number;
	} | null>(null);
	let containerEl = $state<HTMLDivElement>();
	let buttonEl = $state<HTMLButtonElement>();
	let ignoreNextMouseup = false;

	function handleSelection(e: MouseEvent) {
		// If the click was on the "Add Annotation" button, don't clear state
		if (
			buttonEl &&
			(buttonEl === e.target || buttonEl.contains(e.target as Node))
		) {
			return;
		}

		const sel = window.getSelection();
		if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
			buttonPos = null;
			pendingSelection = null;
			return;
		}

		const range = sel.getRangeAt(0);
		const rawSelected = range.toString();
		const text = rawSelected.trim();
		if (!text) {
			buttonPos = null;
			pendingSelection = null;
			return;
		}
		const leadingWS = rawSelected.length - rawSelected.trimStart().length;
		const trailingWS = rawSelected.length - rawSelected.trimEnd().length;

		// Make sure the selection is within our container
		if (
			!containerEl ||
			!containerEl.contains(range.commonAncestorContainer)
		) {
			return;
		}

		// Calculate pixel position from the selection range
		const rect = range.getBoundingClientRect();
		const containerRect = containerEl.getBoundingClientRect();
		buttonPos = {
			top: rect.bottom - containerRect.top + 8,
			left: rect.left - containerRect.left + rect.width / 2,
		};

		// Helper to properly resolve [data-start] element and text offset
		function resolveOffset(node: Node, offset: number, isEnd: boolean) {
			let targetEl: Element | null = null;
			let textOffset = 0;

			if (node.nodeType === Node.TEXT_NODE) {
				targetEl = node.parentElement?.closest("[data-start]") || null;
				textOffset = offset;
			} else {
				const el = node as HTMLElement;
				targetEl = el.closest("[data-start]");
				if (!targetEl) {
					// Fallback: looking for child node at offset
					const idx = isEnd ? Math.max(0, offset - 1) : offset;
					const child =
						node.childNodes[
							Math.min(idx, node.childNodes.length - 1)
						];
					if (child) {
						if (child.nodeType === Node.TEXT_NODE) {
							targetEl =
								child.parentElement?.closest("[data-start]") ||
								null;
							textOffset = isEnd
								? child.textContent?.length || 0
								: 0;
						} else if (child instanceof HTMLElement) {
							targetEl =
								child.closest("[data-start]") ||
								child.querySelector("[data-start]");
							textOffset = isEnd
								? targetEl?.textContent?.length || 0
								: 0;
						}
					}
					// Extreme fallback: find any [data-start] inside
					if (!targetEl) {
						const parts = el.querySelectorAll("[data-start]");
						if (parts.length > 0) {
							targetEl = isEnd
								? parts[parts.length - 1]
								: parts[0];
							textOffset = isEnd
								? targetEl.textContent?.length || 0
								: 0;
						}
					}
				} else {
					// Node was an element with data-start
					textOffset = offset; // Might need to be 0 or length depending on where they clicked
				}
			}

			if (targetEl) {
				const baseOffset = parseInt(
					targetEl.getAttribute("data-start") || "0",
				);
				return baseOffset + textOffset;
			}
			return null;
		}

		const resolvedStart = resolveOffset(
			range.startContainer,
			range.startOffset,
			false,
		);
		const resolvedEnd = resolveOffset(
			range.endContainer,
			range.endOffset,
			true,
		);

		if (resolvedStart !== null && resolvedEnd !== null) {
			pendingSelection = { text, start: resolvedStart + leadingWS, end: resolvedEnd - trailingWS };
		} else {
			pendingSelection = { text, start: 0, end: text.length };
		}
	}

	function confirmSelection() {
		if (pendingSelection) {
			onSelect(pendingSelection);
			buttonPos = null;
			pendingSelection = null;
			window.getSelection()?.removeAllRanges();
		}
	}

	$effect(() => {
		document.addEventListener("mouseup", handleSelection);
		return () => {
			document.removeEventListener("mouseup", handleSelection);
		};
	});
</script>

<div bind:this={containerEl} class="relative">
	{@render children()}

	{#if buttonPos}
		<button
			bind:this={buttonEl}
			class="absolute bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg text-m font-medium
			       hover:bg-primary-700 transition-all hover:shadow-xl -translate-x-1/2 z-20"
			style="top: {buttonPos.top}px; left: {buttonPos.left}px;"
			onmousedown={(e) => e.preventDefault()}
			onclick={confirmSelection}
		>
			+ Add Annotation
		</button>
	{/if}
</div>
