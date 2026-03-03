<script lang="ts">
	import type {
		AnnotationLevel,
		Category,
		Annotation,
	} from "$lib/types/annotation";
	import CategorySelect from "./CategorySelect.svelte";
	import MarkdownEditor from "./MarkdownEditor.svelte";
	import WorksCitedEditor from "./WorksCitedEditor.svelte";

	type Props = {
		level: AnnotationLevel;
		availableAnnotations?: Annotation[];
		onChange: (level: AnnotationLevel) => void;
	};
	let { level, availableAnnotations = [], onChange }: Props = $props();
</script>

<div class="space-y-4">
	<div>
		<label
			for="category-select"
			class="block text[13px] font-medium text-gray-600 mb-1"
			>Category</label
		>
		<CategorySelect
			id="category-select"
			selected={level.category}
			level={level.level}
			onChange={(c: Category) => onChange({ ...level, category: c })}
		/>
	</div>
	<div>
		<label
			for="body-editor"
			class="block text[13px] font-medium text-gray-600 mb-1"
		>
			Body <span class="text-gray-500">(Markdown)</span>
		</label>
		<MarkdownEditor
			id="body-editor"
			bind:value={level.body}
			{availableAnnotations}
		/>
	</div>
	<div>
		<label
			for="works-cited-editor"
			class="block text[13px] font-medium text-gray-600 mb-1"
			>Works Cited</label
		>
		<WorksCitedEditor
			id="works-cited-editor"
			works={level.worksCited}
			onChange={(w: string[]) => onChange({ ...level, worksCited: w })}
		/>
	</div>
</div>
