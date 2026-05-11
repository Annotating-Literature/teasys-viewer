import { getAuthorPortraitFile } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const MIME: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
};

export const GET: RequestHandler = async ({ params, locals }) => {
    if (!locals.bucket) {
        throw error(503, 'Portrait storage not available');
    }
    const result = await getAuthorPortraitFile(locals.bucket, locals.db, params.authorSlug);
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
