<script lang="ts">
	import { untrack } from "svelte";
	import type { Annotation, AnnotationLevel } from "$lib/types/annotation";
	import LevelEditor from "./LevelEditor.svelte";

	const CAT_SHORT: Record<string, string> = {
		language: "Lang",
		form: "Form",
		intratextuality: "IntraT",
		intertextuality: "InterT",
		context: "Ctx",
		interpretation: "Interp",
		"textual-variants": "Var",
		questions: "Qst",
	};

	type Props = {
		annotation: Annotation;
		availableAnnotations?: Annotation[];
		onSave: (annotation: Annotation) => void;
		onDelete?: (id: string) => void;
		onCancel: () => void;
	};
	let {
		annotation,
		availableAnnotations = [],
		onSave,
		onDelete,
		onCancel,
	}: Props = $props();

	let formData = $state<Annotation>(untrack(() => JSON.parse(JSON.stringify(annotation))));
	let activeLevelIndex = $state(0);
	let newAuthorInput = $state("");

	const maxLevelNum = $derived(
		formData.levels.length > 0
			? (Math.max(...formData.levels.map((l) => l.level)) as 1 | 2 | 3)
			: 1,
	);

	function addAtLevel(levelNum: 1 | 2 | 3) {
		formData.levels = [
			...formData.levels,
			{ level: levelNum, category: "language", body: "", worksCited: [] },
		];
		activeLevelIndex = formData.levels.length - 1;
	}

	function removeLevel(index: number) {
		if (formData.levels.length <= 1) return;
		const remaining = formData.levels.filter((_, i) => i !== index);
		const nums = new Set(remaining.map((l) => l.level));
		if (nums.has(2) && !nums.has(1)) return;
		if (nums.has(3) && !nums.has(2)) return;
		formData.levels = remaining;
		if (activeLevelIndex >= formData.levels.length) {
			activeLevelIndex = formData.levels.length - 1;
		}
	}

	function addAuthor() {
		const name = newAuthorInput.trim();
		if (!name || formData.authors.includes(name)) return;
		formData.authors = [...formData.authors, name];
		newAuthorInput = "";
	}

	function removeAuthor(index: number) {
		formData.authors = formData.authors.filter((_, i) => i !== index);
	}

	function handleSave() {
		onSave(formData);
	}
</script>

<div class="space-y-5">
	<!-- Authors -->
	<div>
		<label for="authors-input" class="block text[13px] font-medium text-gray-600 mb-1"
			>Authors</label
		>
		<div class="flex flex-wrap gap-1.5 mb-2">
			{#each formData.authors as author, i}
				<span
					class="inline-flex items-center gap-1 px-2 py-0.5 text[13px] font-medium bg-primary-50 text-primary-700 rounded-md"
				>
					{author}
					<button
						class="text-primary-400 hover:text-primary-600 transition-colors ml-0.5"
						onclick={() => removeAuthor(i)}>&times;</button
					>
				</span>
			{/each}
		</div>
		<div class="flex gap-2">
			<input
				id="authors-input"
				type="text"
				list="author-suggestions"
				class="flex-1 px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				placeholder="Add an author..."
				bind:value={newAuthorInput}
				onkeydown={(e) =>
					e.key === "Enter" && (e.preventDefault(), addAuthor())}
			/>
			<datalist id="author-suggestions">
				{#each Array.from(new Set(availableAnnotations.flatMap((a) => a.authors))).filter((a) => !formData.authors.includes(a)) as author}
					<option value={author}></option>
				{/each}
			</datalist>
			<button
				class="px-3 py-2 text-m font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
				onclick={addAuthor}>Add</button
			>
		</div>
	</div>

	<!-- Version -->
	<div>
		<label
			for="annotation-version"
			class="block text[13px] font-medium text-gray-600 mb-1"
			>Version</label
		>
		<input
			id="annotation-version"
			type="number"
			min="1"
			class="w-24 px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
			bind:value={formData.version}
		/>
	</div>

	<!-- Levels -->
	<div>
		<div class="flex items-center justify-between mb-2">
			<span class="text[13px] font-medium text-gray-600">Levels</span>
			<div class="flex gap-2">
				<button
					class="text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
					onclick={() => addAtLevel(maxLevelNum)}
				>
					+ L{maxLevelNum}
				</button>
				{#if maxLevelNum < 3}
					<button
						class="text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
						onclick={() =>
							addAtLevel((maxLevelNum + 1) as 1 | 2 | 3)}
					>
						+ L{maxLevelNum + 1}
					</button>
				{/if}
			</div>
		</div>
		<div class="flex flex-wrap gap-1 mb-3">
			{#each formData.levels as level, i}
				<button
					class="text[13px] font-medium px-2.5 py-1.5 rounded-md transition-all border"
					class:bg-primary-600={i === activeLevelIndex}
					class:text-white={i === activeLevelIndex}
					class:border-primary-600={i === activeLevelIndex}
					class:bg-white={i !== activeLevelIndex}
					class:text-gray-500={i !== activeLevelIndex}
					class:border-gray-200={i !== activeLevelIndex}
					class:hover:border-gray-500={i !== activeLevelIndex}
					onclick={() => (activeLevelIndex = i)}
				>
					L{level.level} · {CAT_SHORT[level.category] ??
						level.category}
				</button>
			{/each}
		</div>
		<div>
			<LevelEditor
				level={formData.levels[activeLevelIndex]}
				{availableAnnotations}
				onChange={(updated: AnnotationLevel) => {
					const newLevels = [...formData.levels];
					newLevels[activeLevelIndex] = updated;
					formData.levels = newLevels;
				}}
			/>
			{#if formData.levels.length > 1}
				<button
					class="mt-2 text-[11px] text-red-500 hover:text-red-600 transition-colors"
					onclick={() => removeLevel(activeLevelIndex)}
				>
					Remove this level
				</button>
			{/if}
		</div>
	</div>

	<!-- Actions -->
	<div
		class="flex items-center justify-between pt-4 border-t border-gray-100"
	>
		<div>
			{#if onDelete}
				<button
					class="text[13px] font-medium text-red-500 hover:text-red-600 transition-colors"
					onclick={() => onDelete!(annotation.id)}
				>
					Delete annotation
				</button>
			{/if}
		</div>
		<div class="flex items-center gap-3">
			<button
				class="text[13px] font-medium text-gray-500 hover:text-gray-700 transition-colors"
				onclick={onCancel}
			>
				Cancel
			</button>
			<button
				class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
				onclick={handleSave}
			>
				Save
			</button>
		</div>
	</div>
</div>
