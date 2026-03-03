import { listTexts, listAnnotations } from '$lib/server/content';
import { slugify } from '$lib/utils/slug';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const texts = await listTexts();

    // Group by author
    const authorMap = new Map<string, { name: string; slug: string; textCount: number; annotationCount: number; types: Set<string> }>();

    for (const text of texts) {
        const slug = slugify(text.author);
        if (!authorMap.has(slug)) {
            authorMap.set(slug, {
                name: text.author,
                slug,
                textCount: 0,
                annotationCount: 0,
                types: new Set()
            });
        }
        const entry = authorMap.get(slug)!;
        entry.textCount++;
        entry.types.add(text.type);
        const annotations = await listAnnotations(text.id);
        entry.annotationCount += annotations.length;
    }

    const authors = Array.from(authorMap.values())
        .map((a) => ({
            name: a.name,
            slug: a.slug,
            textCount: a.textCount,
            annotationCount: a.annotationCount,
            types: Array.from(a.types)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    return { authors };
};
