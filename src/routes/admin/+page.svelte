<script lang="ts">
	import type { PageData } from "./$types";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
	import QuickStats from "$lib/components/admin/QuickStats.svelte";
	import DetailedStats from "$lib/components/admin/DetailedStats.svelte";
	import GroupedTextList from "$lib/components/admin/GroupedTextList.svelte";

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
			if (t.parentId) continue;
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
			if (t.parentId) continue;
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

	<QuickStats
		{texts}
		{totalTexts}
		{totalAnnotations}
		{byType}
		{typeLabel}
	/>

	<DetailedStats
		{totalAnnotations}
		stats={data.stats}
	/>

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
				{data.user?.role === "admin" ? "Manage Users" : "Manage Account"}
			</h2>
			<p class="text-[13px] text-gray-500 mt-0.5">
				{data.user?.role === "admin" ? "Add and remove editor accounts" : "Change your password"}
			</p>
		</a>

		<a
			href="/admin/pages"
			class="group block p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-200"
		>
			<div
				class="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center mb-2 text-primary-500"
			>
				<svg
					class="w-5 h-5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path
						d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
					></path>
					<polyline points="14 2 14 8 20 8"></polyline>
					<line x1="16" y1="13" x2="8" y2="13"></line>
					<line x1="16" y1="17" x2="8" y2="17"></line>
					<polyline points="10 9 9 9 8 9"></polyline>
				</svg>
			</div>
			<h2
				class="text-base font-semibold text-gray-900 group-hover:text-primary-700 transition-colors"
			>
				Manage Pages
			</h2>
			<p class="text-[13px] text-gray-500 mt-0.5">
				Edit standalone CMS pages
			</p>
		</a>
	</div>

	<!-- Author profiles management -->
	<div class="mb-10">
		<h2 class="text-m font-semibold text-gray-900 mb-3">Author Profiles</h2>
		<p class="text[13px] text-gray-500 mb-4">
			Add bios and portraits to author pages. Click an author to edit
			their profile.
		</p>

		<div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
			{#each byAuthor as [author, authorTexts], i}
				<a
					href={`/admin/authors/${author
						.toLowerCase()
						.replace(/[^a-z0-9]+/g, "-")
						.replace(/^-|-$/g, "")}`}
					class="flex items-center justify-between p-3 {i > 0 ? 'border-t border-gray-50' : ''} hover:bg-gray-50/80 transition-colors"
				>
					<span class="text-m font-medium text-gray-800">{author}</span>
					<span class="text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full">
						{authorTexts.length} text{authorTexts.length !== 1 ? "s" : ""}
					</span>
				</a>
			{/each}
			{#each data.extraAuthors as extra, i}
				<a
					href={`/admin/authors/${extra.slug}`}
					class="flex items-center justify-between p-3 border-t border-gray-50 hover:bg-gray-50/80 transition-colors"
				>
					<span class="text-m font-medium text-gray-800">{extra.name}</span>
					<span class="text-[11px] font-medium text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full">
						standalone
					</span>
				</a>
			{/each}
		</div>
	</div>

	<GroupedTextList groups={byCategory} title="By Category" />
	<GroupedTextList groups={byAuthor} title="By Author" />
</div>
