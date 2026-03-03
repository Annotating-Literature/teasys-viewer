<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
	<h1 class="text-6xl font-bold text-red-600">{$page.status}</h1>
	<p class="text-2xl mt-4">{$page.error?.message}</p>
	<a href="/" class="mt-8 px-4 py-2 bg-blue-600 text-white rounded-md">Go to Homepage</a>
</div>
