import { listTexts, listAnnotations } from '$lib/server/content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const texts = await listTexts();

    // Load annotations for each text
    const textsWithAnnotations = await Promise.all(
        texts.map(async (text) => {
            const annotations = await listAnnotations(text.id);
            return { ...text, annotations };
        })
    );

    return { textsWithAnnotations };
};
