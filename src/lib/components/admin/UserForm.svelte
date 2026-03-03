<script lang="ts">
	import { enhance } from "$app/forms";
</script>

<div class="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
	<h3 class="text-m font-semibold text-gray-900 mb-4">Add New User</h3>
	<form action="?/createUser" method="POST" use:enhance>
		<div class="flex items-end gap-3">
			<div class="flex-1">
				<label
					for="username"
					class="block text-s font-medium text-gray-600 mb-1"
					>Username</label
				>
				<input
					id="username"
					type="text"
					name="username"
					required
					placeholder="Enter username"
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				/>
			</div>
			<div class="flex-1">
				<label
					for="password"
					class="block text-s font-medium text-gray-600 mb-1"
					>Password</label
				>
				<input
					id="password"
					type="password"
					name="password"
					required
					placeholder="Enter password"
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all placeholder:text-gray-500"
				/>
			</div>
			<div class="w-32">
				<label
					for="role"
					class="block text-s font-medium text-gray-600 mb-1"
					>Role</label
				>
				<select
					id="role"
					name="role"
					class="w-full px-3 py-2 text-m border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
				>
					<option value="editor">Editor</option>
					<option value="admin">Admin</option>
				</select>
			</div>
			<button
				type="submit"
				class="px-4 py-2 text-m font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
			>
				Add User
			</button>
		</div>
	</form>
</div>
