import { getPage, savePage, listPages } from '$lib/server/pages';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { slugify } from '$lib/utils/slug';

export const load: PageServerLoad = async ({ params }) => {
    const allPages = await listPages();

    if (params.slug === 'new') {
        return {
            page: null,
            content: '',
            allPages
        };
    }

    try {
        const page = await getPage(params.slug);
        return {
            page: page.metadata,
            content: page.content,
            allPages
        };
    } catch (e) {
        throw redirect(303, '/admin/pages');
    }
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const data = await request.formData();
        const title = data.get('title')?.toString();
        const content = data.get('content')?.toString() || '';
        
        // Checkboxes only send 'on' when checked, otherwise null
        const menu = data.get('menu') === 'on';
        const parent = data.get('parent')?.toString() || '';

        if (!title) {
            return fail(400, { error: 'Title is required', title, content });
        }

        let slug = params.slug;
        // Generate slug for new pages
        if (slug === 'new') {
            slug = slugify(title);
        }

        try {
            await savePage(slug, title, content, menu, parent);
        } catch (e) {
            return fail(500, { error: 'Failed to save page', title, content });
        }

        if (params.slug === 'new') {
            throw redirect(303, `/admin/pages/${slug}`);
        }

        return { success: true };
    }
};
