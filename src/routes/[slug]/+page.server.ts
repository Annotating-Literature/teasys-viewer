import { getPage } from '$lib/server/pages';
import { listTexts } from '$lib/server/content';
import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, platform }) => {
    const db = platform!.env.DB;
    try {
        const page = await getPage(db, params.slug);

        const applySmartQuotes = (text: string) => {
            return text
                .replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018")
                .replace(/'/g, "\u2019")
                .replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c")
                .replace(/"/g, "\u201d");
        };

        const processedContent = applySmartQuotes(page.content);

        const renderer = new marked.Renderer();
        const originalImage = renderer.image.bind(renderer);
        renderer.image = (token) => {
            let alignClass = '';
            let parsedHref = token.href || '';

            if (parsedHref.endsWith('#align-left')) {
                alignClass = 'float-left w-1/2 md:w-1/3 mr-6 mb-4 rounded-xl shadow-sm';
                parsedHref = parsedHref.replace('#align-left', '');
            } else if (parsedHref.endsWith('#align-right')) {
                alignClass = 'float-right w-1/2 md:w-1/3 ml-6 mb-4 rounded-xl shadow-sm';
                parsedHref = parsedHref.replace('#align-right', '');
            } else if (parsedHref.endsWith('#full-width')) {
                alignClass = 'w-[100vw] max-w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] shadow-sm my-8 object-cover';
                parsedHref = parsedHref.replace('#full-width', '');
            } else if (parsedHref.endsWith('#inline')) {
                alignClass = 'w-full rounded-xl shadow-sm my-6';
                parsedHref = parsedHref.replace('#inline', '');
            } else {
                alignClass = 'rounded-xl shadow-sm my-6 max-w-full';
            }

            const imgHtml = originalImage({ ...token, href: parsedHref });
            return imgHtml.replace('<img ', `<img class="${alignClass}" `);
        };

        const htmlContent = await marked.parse(processedContent, { renderer });

        const categoryTypes = ['poetry', 'prose', 'drama'];
        let categoryTexts: any[] | null = null;

        if (categoryTypes.includes(params.slug)) {
            const allTexts = await listTexts(db);
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
