import { listPages, deletePage, movePage } from '$lib/server/pages';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const db = locals.db;
    const pages = await listPages(db);
    return { pages };
};

export const actions: Actions = {
    delete: async ({ request, locals }) => {
        const data = await request.formData();
        const slug = data.get('slug')?.toString();
        if (slug) {
            try {
                await deletePage(locals.db, slug);
                return { success: true };
            } catch {
                return fail(500, { error: 'Failed to delete page' });
            }
        }
        return fail(400, { error: 'Missing slug' });
    },

    move: async ({ request, locals }) => {
        const data = await request.formData();
        const slug = data.get('slug')?.toString();
        const direction = data.get('direction')?.toString() as 'up' | 'down' | undefined;
        if (!slug || (direction !== 'up' && direction !== 'down')) {
            return fail(400, { error: 'Missing slug or direction' });
        }
        try {
            await movePage(locals.db, slug, direction);
            return { success: true };
        } catch {
            return fail(500, { error: 'Failed to reorder page' });
        }
    }
};
