import { listTexts, getAnnotationCount, listAuthorDirectories, getAuthorProfile } from '$lib/server/content';
import { slugify } from '$lib/utils/slug';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const texts = await listTexts();

    // Group by author from texts
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
        const count = await getAnnotationCount(text.id);
        entry.annotationCount += count;
    }

    // Merge standalone authors (from content/authors/ directories)
    const standaloneAuthors = await listAuthorDirectories();
    for (const sa of standaloneAuthors) {
        if (!authorMap.has(sa.slug)) {
            authorMap.set(sa.slug, {
                name: sa.name,
                slug: sa.slug,
                textCount: 0,
                annotationCount: 0,
                types: new Set()
            });
        }
    }

    const authorList = Array.from(authorMap.values())
        .map((a) => ({
            name: a.name,
            slug: a.slug,
            textCount: a.textCount,
            annotationCount: a.annotationCount,
            types: Array.from(a.types)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

    // Attach portrait paths and years
    const authors = await Promise.all(
        authorList.map(async (a) => {
            const profile = await getAuthorProfile(a.slug);
            return {
                ...a,
                portraitPath: profile?.portraitPath ?? null,
                birthYear: profile?.birthYear ?? null,
                deathYear: profile?.deathYear ?? null,
            };
        })
    );

    return { authors };
};
