<script lang="ts">
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
	import { slugify } from "$lib/utils/slug";

	let { textMetadata, user } = $props<{
		textMetadata: any;
		user: any;
	}>();
</script>

<div class="mb-8">
	<Breadcrumbs
		crumbs={[
			{ label: "Library", href: "/" },
			{
				label: textMetadata.author,
				href: `/authors/${slugify(textMetadata.author)}`,
			},
			{ label: textMetadata.title },
		]}
	/>
	<div class="flex items-start justify-between">
		<div>
			<h1 class="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">
				{textMetadata.title}
			</h1>
			<p class="mt-2 text-lg text-gray-500">
				<a
					href={`/authors/${slugify(textMetadata.author)}`}
					class="hover:text-primary-600 transition-colors"
				>{textMetadata.author}</a>
				{#if textMetadata.year}
					<span class="text-gray-500 mx-2">·</span>
					<span class="text-gray-500">{textMetadata.year}</span>
				{/if}
			</p>
		</div>
		{#if user}
			<a
				href={`/texts/${textMetadata.id}/annotate`}
				class="shrink-0 ml-4 inline-flex items-center gap-2 px-4 py-2 text-m font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/40 dark:text-primary-300 dark:hover:bg-primary-800 rounded-lg transition-colors"
			>
				<svg
					class="w-3.5 h-3.5"
					viewBox="0 0 14 14"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M10 2l2 2-7 7H3v-2l7-7z" />
				</svg>
				Annotate
			</a>
		{/if}
	</div>
</div>
