import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterNode from '@sveltejs/adapter-node';

const ADAPTER = process.env.ADAPTER || 'cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter:
			ADAPTER === 'node'
				? adapterNode({ out: 'build' })
				: adapterCloudflare(),
	},
};

export default config;
