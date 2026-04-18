import { getAuthorPortraitFile } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MIME: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
};

export const GET: RequestHandler = async ({ params, platform }) => {
    const result = await getAuthorPortraitFile(platform!.env.BUCKET, platform!.env.DB, params.authorSlug);
    if (!result) {
        throw error(404, 'Portrait not found');
    }

    return new Response(new Uint8Array(result.data), {
        headers: {
            'Content-Type': MIME[result.ext] || 'application/octet-stream',
            'Cache-Control': 'public, max-age=604800'
        }
    });
};
