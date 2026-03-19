<script lang="ts">
	import type { PageData, ActionData } from "./$types";
	import { enhance } from "$app/forms";
	import UserForm from "$lib/components/admin/UserForm.svelte";
	import Breadcrumbs from "$lib/components/layout/Breadcrumbs.svelte";
	type User = { id: number; username: string; role: string };
	let { data, form }: { data: { users: User[], currentUser: User }, form: ActionData } = $props();

	let editingPasswordId = $state<number | null>(null);
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
		{#if data.currentUser?.role === 'admin'}
			<UserForm />
		{:else}
			<div class="bg-gray-50/50 p-6 rounded-xl border border-gray-100 flex items-center justify-between">
				<div>
					<h3 class="font-semibold text-gray-900 mb-1">Editor Account</h3>
					<p class="text-sm text-gray-500">You can manage your own password below. Contact an administrator to add or remove other accounts.</p>
				</div>
			</div>
		{/if}
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
							<span
								class="text[13px] font-semibold text-primary-700"
								>{user.username[0].toUpperCase()}</span
							>
						</div>
						<div>
							<p class="font-semibold text-m text-gray-900">
								{user.username}
							</p>
							<p class="text[13px] text-gray-500 capitalize">
								{user.role}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2">
						{#if data.currentUser?.role === 'admin' || data.currentUser?.id === user.id}
							<button
								type="button"
								onclick={() => editingPasswordId = editingPasswordId === user.id ? null : user.id}
								class="text[13px] font-medium text-gray-500 hover:text-gray-900 px-2.5 py-1 rounded-md hover:bg-gray-100 transition-colors"
							>
								{editingPasswordId === user.id ? 'Cancel' : 'Change Password'}
							</button>
						{/if}
						{#if data.currentUser?.role === 'admin'}
							<form action={`?/deleteUser`} method="POST">
								<input type="hidden" name="id" value={user.id} />
								<button
									type="submit"
									class="text-[13px] font-medium text-red-500 hover:text-red-600 px-2.5 py-1 rounded-md hover:bg-red-50 transition-colors"
								>
									Delete
								</button>
							</form>
						{/if}
					</div>
				</div>
				
				{#if editingPasswordId === user.id}
					<div class="p-4 border-t border-gray-50 bg-gray-50/30">
						<form action="?/changePassword" method="POST" class="flex items-start gap-4"
							use:enhance={() => async ({ result, update }) => {
								await update();
								if (result.type === 'success') editingPasswordId = null;
							}}>
							<input type="hidden" name="id" value={user.id} />
							<div class="flex-1">
								<input
									type="password"
									name="new_password"
									placeholder="New password"
									required
									minlength="6"
									class="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-white"
								/>
								{#if form?.message}
									<p class="text-[11px] text-red-500 mt-1.5 ml-1">{form.message}</p>
								{/if}
							</div>
							<button 
								type="submit"
								class="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors"
							>
								Save
							</button>
						</form>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
