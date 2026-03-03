<script lang="ts">
	import type { PageData } from "./$types";
	import UserForm from "$lib/components/admin/UserForm.svelte";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
	type User = { id: number; username: string; role: string };
	let { data }: { data: { users: User[] } } = $props();
</script>

<svelte:head>
	<title>Manage Users — TEASys Viewer</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-10">
	<div class="mb-8">
		<Breadcrumbs
			crumbs={[
				{ label: "Library", href: "/" },
				{ label: "Admin", href: "/admin" },
				{ label: "Users" },
			]}
		/>
		<h1 class="text-2xl font-bold text-gray-900">Manage Users</h1>
	</div>

	<div class="mb-8">
		<UserForm />
	</div>

	{#if data.users.length > 0}
		<div
			class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
		>
			{#each data.users as user, i}
				<div
					class="flex items-center justify-between p-4 {i > 0
						? 'border-t border-gray-50'
						: ''} hover:bg-gray-50/50 transition-colors"
				>
					<div class="flex items-center gap-3">
						<div
							class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center"
						>
							<span class="text-s font-semibold text-primary-700"
								>{user.username[0].toUpperCase()}</span
							>
						</div>
						<div>
							<p class="font-semibold text-m text-gray-900">
								{user.username}
							</p>
							<p class="text-s text-gray-500 capitalize">
								{user.role}
							</p>
						</div>
					</div>
					<form action={`?/deleteUser`} method="POST">
						<input type="hidden" name="id" value={user.id} />
						<button
							type="submit"
							class="text-s font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
						>
							Delete
						</button>
					</form>
				</div>
			{/each}
		</div>
	{/if}
</div>
