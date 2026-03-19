import { getPage } from '$lib/server/pages';
import { listTexts } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    try {
        const page = await getPage(params.slug);
        
        const applySmartQuotes = (text: string) => {
            return text
                .replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018")      // opening singles
                .replace(/'/g, "\u2019")                          // closing singles & apostrophes
                .replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c") // opening doubles
                .replace(/"/g, "\u201d");                         // closing doubles
        };

        const processedContent = applySmartQuotes(page.content);
        const rawHtml = await marked.parse(processedContent);
        const htmlContent = DOMPurify.sanitize(rawHtml);

        // If this page is one of the main categories, fetch the respective texts
        const categoryTypes = ['poetry', 'prose', 'drama'];
        let categoryTexts: any[] | null = null;

        if (categoryTypes.includes(params.slug)) {
            const allTexts = await listTexts();
            categoryTexts = allTexts
                .filter(t => t.type === params.slug && !t.parentId)
                .sort((a, b) => {
                    const catCmp = (a.category || '').localeCompare(b.category || '');
                    if (catCmp !== 0) return catCmp;
                    const authCmp = a.author.localeCompare(b.author);
                    if (authCmp !== 0) return authCmp;
                    return a.title.localeCompare(b.title);
                });
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
