<script lang="ts">
	import type { PageData } from "./$types";
	import { CATEGORY_META } from "$lib/constants";
	import IconQuill from "$lib/components/icons/IconQuill.svelte";
	import IconNotebook from "$lib/components/icons/IconNotebook.svelte";
	import IconTheatreMasks from "$lib/components/icons/IconTheatreMasks.svelte";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";

	let { data } = $props();

	const texts = $derived(data.textsWithAnnotations ?? []);

	// Stats
	const totalTexts = $derived(texts.length);
	const totalAnnotations = $derived(
		texts.reduce((sum, t) => sum + t.annotations.length, 0),
	);

	// By type
	const byType = $derived.by(() => {
		const counts: Record<string, number> = {
			poetry: 0,
			prose: 0,
			drama: 0,
		};
		for (const t of texts) counts[t.type] = (counts[t.type] || 0) + 1;
		return counts;
	});

	// By category (tag)
	const byCategory = $derived.by(() => {
		const groups: Record<string, typeof texts> = {};
		for (const t of texts) {
			const cat = t.category || "Uncategorized";
			if (!groups[cat]) groups[cat] = [];
			groups[cat].push(t);
		}
		return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
	});

	// By author
	const byAuthor = $derived.by(() => {
		const groups: Record<string, typeof texts> = {};
		for (const t of texts) {
			const auth = t.author || "Unknown";
			if (!groups[auth]) groups[auth] = [];
			groups[auth].push(t);
		}
		return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
	});

	const typeLabel: Record<string, string> = {
		poetry: "Poetry",
		prose: "Prose",
		drama: "Drama",
	};
</script>

<svelte:head>
	<title>Admin — TEASys Viewer</title>
</svelte:head>

<div class="max-w-5xl mx-auto px-6 py-10">
	<div class="mb-8">
		<Breadcrumbs
			crumbs={[{ label: "Library", href: "/" }, { label: "Admin" }]}
		/>
		<h1 class="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
	</div>

	<!-- Quick stats -->
	<div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
			<p
				class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1"
			>
				<svg
					class="w-3.5 h-3.5"
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					stroke-width="1.3"
					><rect x="2" y="1" width="12" height="14" rx="1" /><path
						d="M5 4h6M5 7h6M5 10h4"
					/></svg
				>
				Texts
			</p>
			<p class="text-2xl font-bold text-gray-900">{totalTexts}</p>
		</div>
		<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
			<p
				class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1"
			>
				Annotations
			</p>
			<p class="text-2xl font-bold text-gray-900">{totalAnnotations}</p>
		</div>
		{#each ["poetry", "prose", "drama"] as type}
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-4"
			>
				<p
					class="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1"
				>
					{#if type === "poetry"}
						<IconQuill class="w-3.5 h-3.5" />
					{:else if type === "prose"}
						<IconNotebook class="w-3.5 h-3.5" />
					{:else}
						<IconTheatreMasks class="w-3.5 h-3.5" />
					{/if}
					{typeLabel[type]}
				</p>
				<p class="text-2xl font-bold text-gray-900">
					{byType[type] || 0}
				</p>
			</div>
		{/each}
	</div>

	<!-- Detailed stats -->
	{#if totalAnnotations > 0}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
			<!-- Annotation depth -->
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
			>
				<h3
					class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3"
				>
					Annotation Depth
				</h3>
				<div class="space-y-2.5">
					{#each [1, 2, 3] as level}
						{@const count = data.stats.levelCounts[level] || 0}
						{@const pct =
							totalAnnotations > 0
								? Math.round(
										(count /
											Math.max(
												data.stats.levelCounts[1] +
													data.stats.levelCounts[2] +
													data.stats.levelCounts[3],
												1,
											)) *
											100,
									)
								: 0}
						<div>
							<div
								class="flex items-center justify-between text[13px] mb-1"
							>
								<span class="text-gray-600">Level {level}</span>
								<span class="text-gray-500">{count}</span>
							</div>
							<div
								class="h-1.5 bg-gray-100 rounded-full overflow-hidden"
							>
								<div
									class="h-full rounded-full transition-all duration-500"
									class:bg-primary-300={level === 1}
									class:bg-primary-500={level === 2}
									class:bg-primary-700={level === 3}
									style="width: {pct}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
				<div
					class="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text[13px] text-gray-500"
				>
					<span>Avg per text</span>
					<span class="font-semibold text-gray-700"
						>{data.stats.avgAnnotations}</span
					>
				</div>
			</div>

			<!-- Category breakdown -->
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-5"
			>
				<h3
					class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-3"
				>
					Categories
				</h3>
				<div class="space-y-2">
					{#each data.stats.categoryCounts as [cat, count]}
						{@const total = data.stats.categoryCounts.reduce(
							(s, [, c]) => s + c,
							0,
						)}
						{@const pct = Math.round(
							(count / Math.max(total, 1)) * 100,
						)}
						<div class="flex items-center gap-2.5">
							<span
								class="text[13px] text-gray-600 w-28 truncate capitalize"
								>{cat.replace(/-/g, " ")}</span
							>
							<div
								class="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden"
							>
								<div
									class="h-full bg-primary-400 rounded-full"
									style="width: {pct}%"
								></div>
							</div>
							<span
								class="text-[11px] text-gray-500 w-6 text-right"
								>{count}</span
							>
						</div>
					{/each}
				</div>
			</div>

			<!-- Highlights -->
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4"
			>
				<h3
					class="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1"
				>
					Highlights
				</h3>

				{#if data.stats.mostAnnotated}
					<div>
						<p
							class="text-[11px] text-gray-500 uppercase tracking-wider"
						>
							Most Annotated
						</p>
						<a
							href={`/texts/${data.stats.mostAnnotated.id}`}
							class="text-m font-medium text-gray-800 hover:text-primary-600 transition-colors line-clamp-1"
						>
							{data.stats.mostAnnotated.title}
						</a>
						<p class="text-[11px] text-gray-500">
							{data.stats.mostAnnotated.count} annotations
						</p>
					</div>
				{/if}

				<div class="flex gap-4">
					<div>
						<p
							class="text-[11px] text-gray-500 uppercase tracking-wider"
						>
							Contributors
						</p>
						<p class="text-lg font-bold text-gray-900">
							{data.stats.contributors}
						</p>
					</div>
					<div>
						<p
							class="text-[11px] text-gray-500 uppercase tracking-wider"
						>
							Cross-refs
						</p>
						<p class="text-lg font-bold text-gray-900">
							{data.stats.totalCrossRefs}
						</p>
					</div>
					<div>
						<p
							class="text-[11px] text-gray-500 uppercase tracking-wider"
						>
							Citations
						</p>
						<p class="text-lg font-bold text-gray-900">
							{data.stats.totalWorksCited}
						</p>
					</div>
				</div>

				{#if data.stats.mostRecent}
					<div class="pt-2 border-t border-gray-50">
						<p
							class="text-[11px] text-gray-500 uppercase tracking-wider"
						>
							Last Activity
						</p>
						<p class="text[13px] text-gray-600 mt-0.5 line-clamp-1">
							"{data.stats.mostRecent.anchorText}"
						</p>
						<p class="text-[11px] text-gray-500">
							by {data.stats.mostRecent.authors.join(", ")} · {new Date(
								data.stats.mostRecent.updatedAt,
							).toLocaleDateString()}
						</p>
					</div>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Management links -->
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
		<a
			href="/admin/texts"
			class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"
		>
			<div
				class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					><rect x="3" y="2" width="14" height="16" rx="1.5" /><path
						d="M7 6h6M7 9h6M7 12h4"
					/></svg
				>
			</div>
			<h2
				class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors"
			>
				Manage Texts
			</h2>
			<p class="text[13px] text-gray-500 mt-0.5">
				Add and remove literary texts
			</p>
		</a>
		{#if data.user?.role === "admin"}
			<a
				href="/admin/users"
				class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"
			>
				<div
					class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"
				>
					<svg
						class="w-5 h-5"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						><circle cx="10" cy="7" r="3.5" /><path
							d="M3.5 17c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5"
						/></svg
					>
				</div>
				<h2
					class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors"
				>
					Manage Users
				</h2>
				<p class="text[13px] text-gray-500 mt-0.5">
					Add and remove editor accounts
				</p>
			</a>
		{/if}
	</div>

	<!-- Author profiles management -->
	<div class="mb-10">
		<h2 class="text-m font-semibold text-gray-900 mb-3">Author Profiles</h2>
		<p class="text[13px] text-gray-500 mb-4">
			Add bios and portraits to author pages. Click an author to edit
			their profile.
		</p>

		<!-- Create new author -->
		<form method="POST" action="?/createAuthor" class="flex gap-2 mb-4">
			<input
				type="text"
				name="name"
				placeholder="New author name..."
				class="flex-1 px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
			/>
			<button
				type="submit"
				class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
			>
				Add Author
			</button>
		</form>

		<div
			class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
		>
			{#each byAuthor as [author, authorTexts], i}
				<a
					href={`/admin/authors/${author
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/^-|-$/g, "")}`}
					class="flex items-center justify-between p-3 {i > 0
						? 'border-t border-gray-50'
						: ''} hover:bg-gray-50/80 transition-colors"
				>
					<span class="text-m font-medium text-gray-800"
						>{author}</span
					>
					<span
						class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
					>
						{authorTexts.length} text{authorTexts.length !== 1
							? "s"
							: ""}
					</span>
				</a>
			{/each}
			{#each data.extraAuthors as extra, i}
				<a
					href={`/admin/authors/${extra.slug}`}
					class="flex items-center justify-between p-3 border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
				>
					<span class="text-m font-medium text-gray-800"
						>{extra.name}</span
					>
					<span
						class="text-[11px] font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full"
					>
						standalone
					</span>
				</a>
			{/each}
		</div>
	</div>

	<!-- By Category -->
	{#if byCategory.length > 0}
		<div class="mb-8">
			<h2 class="text-m font-semibold text-gray-900 mb-3">By Category</h2>
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
			>
				{#each byCategory as [category, categoryTexts], i}
					<div class="p-4 {i > 0 ? 'border-t border-gray-50' : ''}">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-m font-medium text-gray-800">
								{category}
							</h3>
							<span
								class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
							>
								{categoryTexts.length} text{categoryTexts.length !==
								1
									? "s"
									: ""}
							</span>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each categoryTexts as t}
								<a
									href={`/texts/${t.id}`}
									class="inline-flex items-center gap-1.5 px-2.5 py-1 text[13px] bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
								>
									<span
										class="text-[11px] text-gray-500 font-medium"
										>{t.type}</span
									>
									<span class="font-medium">{t.title}</span>
									{#if t.annotations.length > 0}
										<span class="text-gray-500"
											>· {t.annotations.length} ann.</span
										>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<!-- By Author -->
	{#if byAuthor.length > 0}
		<div>
			<h2 class="text-m font-semibold text-gray-900 mb-3">By Author</h2>
			<div
				class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
			>
				{#each byAuthor as [author, authorTexts], i}
					<div class="p-4 {i > 0 ? 'border-t border-gray-50' : ''}">
						<div class="flex items-center justify-between mb-2">
							<h3 class="text-m font-medium text-gray-800">
								{author}
							</h3>
							<span
								class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full"
							>
								{authorTexts.length} text{authorTexts.length !==
								1
									? "s"
									: ""}
							</span>
						</div>
						<div class="flex flex-wrap gap-2">
							{#each authorTexts as t}
								<a
									href={`/texts/${t.id}`}
									class="inline-flex items-center gap-1.5 px-2.5 py-1 text[13px] bg-gray-50 hover:bg-primary-50 text-gray-700 hover:text-primary-700 rounded-md transition-colors"
								>
									<span
										class="text-[11px] text-gray-500 font-medium"
										>{t.type}</span
									>
									<span class="font-medium">{t.title}</span>
									{#if t.annotations.length > 0}
										<span class="text-gray-500"
											>· {t.annotations.length} ann.</span
										>
									{/if}
								</a>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
