<script lang="ts">
	type Props = {
		id: string;
		works: string[];
		onChange: (works: string[]) => void;
	};
	let { id, works, onChange }: Props = $props();

	let inputEls = $state<(HTMLTextAreaElement | null)[]>([]);

	function addWork() {
		onChange([...works, ""]);
	}

	function removeWork(index: number) {
		onChange(works.filter((_work, i) => i !== index));
	}

	function updateWork(index: number, value: string) {
		const newWorks = [...works];
		newWorks[index] = value;
		onChange(newWorks);
	}

	function applyItalic(i: number) {
		const el = inputEls[i];
		if (!el) return;
		const s = el.selectionStart ?? 0;
		const e = el.selectionEnd ?? 0;
		if (s === e) return;
		const val = works[i];
		updateWork(
			i,
			val.slice(0, s) + "*" + val.slice(s, e) + "*" + val.slice(e),
		);
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(s + 1, e + 1);
		});
	}

	function applyBold(i: number) {
		const el = inputEls[i];
		if (!el) return;
		const s = el.selectionStart ?? 0;
		const e = el.selectionEnd ?? 0;
		if (s === e) return;
		const val = works[i];
		updateWork(
			i,
			val.slice(0, s) + "**" + val.slice(s, e) + "**" + val.slice(e),
		);
		requestAnimationFrame(() => {
			el.focus();
			el.setSelectionRange(s + 2, e + 2);
		});
	}
</script>

<div {id} class="space-y-2">
	{#each works as work, i}
		<div class="flex items-start gap-1">
			<textarea
				bind:this={inputEls[i]}
				class="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500 min-h-[80px] resize-y"
				placeholder="e.g., Pound, Ezra. *A Retrospect.* **1918**."
				value={work}
				oninput={(e) =>
					updateWork(i, (e.target as HTMLTextAreaElement).value)}
			></textarea>
			<div class="flex flex-col gap-1">
				<button
					type="button"
					class="w-7 h-7 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center text-sm font-sans font-bold"
					title="Bold (select text first)"
					onclick={() => applyBold(i)}
				>
					B
				</button>
				<button
					type="button"
					class="w-7 h-7 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center text-sm font-serif italic font-bold"
					title="Italic (select text first)"
					onclick={() => applyItalic(i)}
				>
					I
				</button>
			</div>
			<button
				class="w-7 h-7 rounded-md text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center"
				onclick={() => removeWork(i)}
			>
				&times;
			</button>
		</div>
	{/each}
	<button
		class="text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
		onclick={addWork}
	>
		+ Add source
	</button>
</div>
