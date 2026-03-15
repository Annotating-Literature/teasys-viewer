import { getPage } from '$lib/server/pages';
import { listTexts } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const page = await getPage(params.slug);
        const htmlContent = await marked.parse(page.content);

        // If this page is one of the main categories, fetch the respective texts
        const categoryTypes = ['poetry', 'prose', 'drama'];
        let categoryTexts: any[] | null = null;

        if (categoryTypes.includes(params.slug)) {
            const allTexts = await listTexts();
            categoryTexts = allTexts
                .filter(t => t.type === params.slug && !t.parentId)
                .sort((a, b) => a.title.localeCompare(b.title));
        }

        return {
            page: page.metadata,
            htmlContent,
            categoryTexts
        };
    } catch (e) {
        throw error(404, 'Page not found');
    }
};
