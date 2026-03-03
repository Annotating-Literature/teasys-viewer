<script lang="ts">
	let { anchorText, onConfirm, onCancel } = $props();
</script>

<div class="p-4 bg-gray-100 rounded-lg mb-4">
	<p class="text-sm text-gray-600">You are annotating:</p>
	<blockquote class="italic font-semibold text-gray-800">"{anchorText}"</blockquote>
	<div class="flex justify-end space-x-2 mt-2">
		<button class="text-sm text-gray-500" onclick={onCancel}>Cancel</button>
		<button class="text-sm text-blue-600 font-bold" onclick={onConfirm}>Confirm</button>
	</div>
</div>
