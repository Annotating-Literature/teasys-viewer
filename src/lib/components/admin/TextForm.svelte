<script lang="ts">
	let { existingCategories = [] }: { existingCategories?: string[] } =
		$props();
	let showCategorySuggestions = $state(false);
	let categoryValue = $state("");
	let submitting = $state(false);
	let error = $state<string | null>(null);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		error = null;

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		try {
			const res = await fetch("/api/texts", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const body = await res
					.json()
					.catch(() => ({ error: "Unknown error" }));
				throw new Error(body.error || "Failed to create text");
			}

			form.reset();
			categoryValue = "";
			window.location.reload();
		} catch (err) {
			error =
				err instanceof Error ? err.message : "Failed to create text";
		} finally {
			submitting = false;
		}
	}
</script>

<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
	<h3 class="text-m font-semibold text-gray-900 mb-4">Add New Text</h3>
	{#if error}
		<div class="mb-4 bg-red-50 text-red-600 text-m rounded-lg px-3 py-2">
			{error}
		</div>
	{/if}
	<form onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
			<div>
				<label
					for="title"
					class="block text-s font-medium text-gray-600 mb-1"
					>Title *</label
				>
				<input
					id="title"
					type="text"
					name="title"
					required
					placeholder="e.g., The Red Wheelbarrow"
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				/>
			</div>
			<div>
				<label
					for="author"
					class="block text-s font-medium text-gray-600 mb-1"
					>Author *</label
				>
				<input
					id="author"
					type="text"
					name="author"
					required
					placeholder="e.g., William Carlos Williams"
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				/>
			</div>
			<div>
				<label
					for="year"
					class="block text-s font-medium text-gray-600 mb-1"
				>
					Year <span class="text-gray-500">(optional)</span>
				</label>
				<input
					id="year"
					type="number"
					name="year"
					placeholder="e.g., 1923"
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				/>
			</div>
			<div class="relative">
				<label
					for="category"
					class="block text-s font-medium text-gray-600 mb-1"
					>Category *</label
				>
				<input
					id="category"
					type="text"
					name="category"
					required
					placeholder="e.g., Imagism"
					bind:value={categoryValue}
					onfocus={() => (showCategorySuggestions = true)}
					onblur={() =>
						setTimeout(
							() => (showCategorySuggestions = false),
							200,
						)}
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				/>
				{#if showCategorySuggestions && existingCategories.length > 0}
					<div
						class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto"
					>
						{#each existingCategories.filter((c) => c
								.toLowerCase()
								.includes(categoryValue.toLowerCase())) as cat}
							<button
								type="button"
								class="w-full text-left px-3 py-1.5 text-m hover:bg-primary-50 transition-colors"
								onmousedown={(e) => {
									e.preventDefault();
									categoryValue = cat;
									showCategorySuggestions = false;
								}}
							>
								{cat}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div class="mb-4">
			<label
				for="type"
				class="block text-s font-medium text-gray-600 mb-1"
				>Type *</label
			>
			<select
				id="type"
				name="type"
				required
				class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
			>
				<option value="poetry">Poetry</option>
				<option value="prose">Prose</option>
				<option value="drama">Drama</option>
			</select>
		</div>
		<div class="mb-4">
			<label
				for="textContent"
				class="block text-s font-medium text-gray-600 mb-1"
				>Full Text *</label
			>
			<textarea
				id="textContent"
				name="textContent"
				required
				rows="8"
				placeholder="Paste the full text here..."
				class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500 font-mono"
			></textarea>
		</div>
		<button
			type="submit"
			disabled={submitting}
			class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
		>
			{submitting ? "Creating..." : "Create Text"}
		</button>
	</form>
</div>
