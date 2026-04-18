import { listTexts, listAuthorDirectories } from '$lib/server/content';
import { slugify } from '$lib/utils/slug';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
    const db = platform!.env.DB;
    const [texts, standaloneAuthors, allAnnotationRows] = await Promise.all([
        listTexts(db),
        listAuthorDirectories(db),
        db.prepare('SELECT text_id, anchor_text, authors, levels, cross_refs, updated_at FROM annotations')
            .all<{ text_id: string; anchor_text: string; authors: string; levels: string; cross_refs: string; updated_at: string }>(),
    ]);

    const allAnnotations = allAnnotationRows.results.map(r => ({
        textId: r.text_id,
        anchorText: r.anchor_text,
        authors: JSON.parse(r.authors) as string[],
        levels: JSON.parse(r.levels) as { level: number; category: string; body: string; worksCited: string[] }[],
        crossRefs: JSON.parse(r.cross_refs) as unknown[],
        updatedAt: r.updated_at,
    }));

    // Build textsWithAnnotations
    const annotationsByText = new Map<string, typeof allAnnotations>();
    for (const ann of allAnnotations) {
        if (!annotationsByText.has(ann.textId)) annotationsByText.set(ann.textId, []);
        annotationsByText.get(ann.textId)!.push(ann);
    }

    const textsWithAnnotations = texts.map(t => ({
        ...t,
        annotations: annotationsByText.get(t.id) ?? []
    }));

    const textAuthorSlugs = new Set(texts.map(t => slugify(t.author)));
    const extraAuthors = standaloneAuthors.filter(a => !textAuthorSlugs.has(a.slug));

    // Stats
    const contributors = new Set<string>();
    for (const ann of allAnnotations) {
        for (const a of ann.authors) contributors.add(a);
    }

    const levelCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
    const categoryCounts: Record<string, number> = {};
    for (const ann of allAnnotations) {
        for (const lvl of ann.levels) {
            levelCounts[lvl.level] = (levelCounts[lvl.level] || 0) + 1;
            categoryCounts[lvl.category] = (categoryCounts[lvl.category] || 0) + 1;
        }
    }

    const mostAnnotated = textsWithAnnotations.length > 0
        ? textsWithAnnotations.reduce((best, t) =>
            t.annotations.length > best.annotations.length ? t : best)
        : null;

    const mostRecent = allAnnotations.length > 0
        ? allAnnotations.reduce((latest, ann) =>
            ann.updatedAt > latest.updatedAt ? ann : latest)
        : null;

    const avgAnnotations = texts.length > 0
        ? Math.round((allAnnotations.length / texts.length) * 10) / 10
        : 0;

    const totalCrossRefs = allAnnotations.reduce((sum, ann) => {
        const fullBody = ann.levels.map((l) => l.body).join('\n');
        const matches = fullBody.match(/\[\[([^\]]+)\]\]/g);
        return sum + (matches ? matches.length : 0);
    }, 0);

    const totalWorksCited = allAnnotations.reduce((sum, ann) =>
        sum + ann.levels.reduce((s, l) => s + l.worksCited.length, 0), 0);

    const stats = {
        contributors: contributors.size,
        contributorNames: Array.from(contributors).sort(),
        levelCounts,
        categoryCounts: Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]),
        mostAnnotated: mostAnnotated ? {
            title: mostAnnotated.title,
            id: mostAnnotated.id,
            count: mostAnnotated.annotations.length
        } : null,
        mostRecent: mostRecent ? {
            anchorText: mostRecent.anchorText,
            updatedAt: mostRecent.updatedAt,
            authors: mostRecent.authors
        } : null,
        avgAnnotations,
        totalCrossRefs,
        totalWorksCited
    };

    return { textsWithAnnotations, extraAuthors, stats };
};
