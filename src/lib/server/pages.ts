import fs from 'fs/promises';
import path from 'path';
import type { PageMetadata } from '$lib/types/page';

const PAGES_DIR = path.resolve('content', 'pages');

export async function listPages(): Promise<PageMetadata[]> {
    try {
        await fs.access(PAGES_DIR);
    } catch {
        await fs.mkdir(PAGES_DIR, { recursive: true });
    }

    const entries = await fs.readdir(PAGES_DIR, { withFileTypes: true });
    const dirs = entries.filter(e => e.isDirectory());

    const pages: PageMetadata[] = [];
    for (const dir of dirs) {
        const metaPath = path.join(PAGES_DIR, dir.name, 'metadata.json');
        try {
            const raw = await fs.readFile(metaPath, 'utf-8');
            const parsed = JSON.parse(raw);
            pages.push(parsed);
        } catch (err) {
            console.warn(`Skipping invalid or missing metadata for page ${dir.name}:`, err);
        }
    }

    return pages.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getPage(slug: string): Promise<{ metadata: PageMetadata; content: string }> {
    try {
        const pageDir = path.join(PAGES_DIR, slug);
        const metaPath = path.join(pageDir, 'metadata.json');
        const contentPath = path.join(pageDir, 'content.md');

        const metaRaw = await fs.readFile(metaPath, 'utf-8');
        const metadata = JSON.parse(metaRaw);

        const content = await fs.readFile(contentPath, 'utf-8');

        return { metadata, content };
    } catch (err) {
        throw new Error(`Page not found: ${slug}`);
    }
}

export async function savePage(slug: string, title: string, content: string): Promise<PageMetadata> {
    const pageDir = path.join(PAGES_DIR, slug);
    await fs.mkdir(pageDir, { recursive: true });

    const metaPath = path.join(pageDir, 'metadata.json');
    const contentPath = path.join(pageDir, 'content.md');

    let metadata: PageMetadata;

    try {
        // Update existing
        const metaRaw = await fs.readFile(metaPath, 'utf-8');
        metadata = JSON.parse(metaRaw);
        metadata.title = title;
        metadata.updatedAt = new Date().toISOString();
    } catch {
        // Create new
        metadata = {
            id: slug,
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    }

    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2), 'utf-8');
    await fs.writeFile(contentPath, content, 'utf-8');

    return metadata;
}

export async function deletePage(slug: string): Promise<void> {
    const pageDir = path.join(PAGES_DIR, slug);
    await fs.rm(pageDir, { recursive: true, force: true });
}
