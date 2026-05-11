import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const ADAPTER = process.env.ADAPTER || 'cloudflare';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	define: {
		__ADAPTER__: JSON.stringify(ADAPTER),
	},
	server: {
		watch: {
			ignored: ['**/content/**'],
		},
	},
	ssr: {
		external: ['bcryptjs', 'better-sqlite3'],
	},
});
