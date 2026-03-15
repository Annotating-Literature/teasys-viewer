import { listTexts, getAuthorProfile, saveAuthorProfile, saveAuthorPortrait } from '$lib/server/content';
import { slugify, findAuthorBySlug } from '$lib/utils/slug';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const allTexts = await listTexts();
    const authorName = findAuthorBySlug(allTexts, params.authorSlug);

    if (!authorName) {
        throw error(404, 'Author not found');
    }

    const profile = await getAuthorProfile(params.authorSlug);

    return {
        author: authorName,
        slug: params.authorSlug,
        bio: profile?.bio ?? '',
        portraitPath: profile?.portraitPath ?? null,
        birthYear: profile?.birthYear ?? null,
        deathYear: profile?.deathYear ?? null,
        photoCredit: profile?.photoCredit ?? null,
        photoCreditUrl: profile?.photoCreditUrl ?? null,
    };
};

export const actions: Actions = {
    default: async ({ request, params }) => {
        const formData = await request.formData();
        const bio = formData.get('bio') as string;
        const portrait = formData.get('portrait') as File | null;
        const birthYearRaw = formData.get('birthYear') as string;
        const deathYearRaw = formData.get('deathYear') as string;
        const photoCredit = formData.get('photoCredit') as string;
        const photoCreditUrl = formData.get('photoCreditUrl') as string;

        if (bio !== null) {
            await saveAuthorProfile(params.authorSlug, bio);
        }

        // Save birth/death years to metadata.json
        const fs = await import('fs/promises');
        const path = await import('path');
        const { AUTHORS_DIR } = await import('$lib/server/content');
        const authorDir = path.join(AUTHORS_DIR, params.authorSlug);
        await fs.mkdir(authorDir, { recursive: true });
        let meta: Record<string, unknown> = {};
        try {
            const raw = await fs.readFile(path.join(authorDir, 'metadata.json'), 'utf-8');
            meta = JSON.parse(raw);
        } catch { /* start fresh */ }
        if (birthYearRaw) meta.birthYear = parseInt(birthYearRaw, 10);
        else delete meta.birthYear;
        if (deathYearRaw) meta.deathYear = parseInt(deathYearRaw, 10);
        else delete meta.deathYear;
        if (photoCredit) meta.photoCredit = photoCredit;
        else delete meta.photoCredit;
        if (photoCreditUrl) meta.photoCreditUrl = photoCreditUrl;
        else delete meta.photoCreditUrl;
        await fs.writeFile(path.join(authorDir, 'metadata.json'), JSON.stringify(meta, null, 2), 'utf-8');

        if (portrait && portrait.size > 0) {
            const ext = portrait.name.split('.').pop()?.toLowerCase() ?? 'jpg';
            if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                return fail(400, { error: 'Invalid image format. Use JPG, PNG, or WebP.' });
            }
            const buffer = Buffer.from(await portrait.arrayBuffer());
            await saveAuthorPortrait(params.authorSlug, buffer, ext);
        }

        throw redirect(303, `/admin/authors/${params.authorSlug}`);
    }
};
