import type { PageMetadata } from '$lib/types/page';

interface PageRow {
	id: string;
	title: string;
	content_md: string;
	menu: number;
	parent: string | null;
	created_at: string;
	updated_at: string;
}

function rowToMetadata(row: PageRow): PageMetadata {
	return {
		id: row.id,
		title: row.title,
		menu: row.menu === 1,
		parent: row.parent ?? undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

export async function listPages(db: D1Database): Promise<PageMetadata[]> {
	const result = await db.prepare(
		'SELECT id, title, menu, parent, created_at, updated_at FROM pages ORDER BY title'
	).all<PageRow>();
	return result.results.map(rowToMetadata);
}

export async function getPage(db: D1Database, slug: string): Promise<{ metadata: PageMetadata; content: string }> {
	const row = await db.prepare('SELECT * FROM pages WHERE id = ?').bind(slug).first<PageRow>();
	if (!row) throw new Error(`Page not found: ${slug}`);
	return { metadata: rowToMetadata(row), content: row.content_md };
}

export async function savePage(db: D1Database, slug: string, title: string, content: string, menu: boolean = true, parent: string = ''): Promise<PageMetadata> {
	const now = new Date().toISOString();
	const existing = await db.prepare('SELECT created_at FROM pages WHERE id = ?').bind(slug).first<{ created_at: string }>();
	const createdAt = existing?.created_at ?? now;

	await db.prepare(`
		INSERT INTO pages (id, title, content_md, menu, parent, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			title = excluded.title,
			content_md = excluded.content_md,
			menu = excluded.menu,
			parent = excluded.parent,
			updated_at = excluded.updated_at
	`).bind(slug, title, content, menu ? 1 : 0, parent || null, createdAt, now).run();

	return {
		id: slug,
		title,
		menu,
		parent: parent || undefined,
		createdAt,
		updatedAt: now,
	};
}

export async function deletePage(db: D1Database, slug: string): Promise<void> {
	await db.prepare('DELETE FROM pages WHERE id = ?').bind(slug).run();
}
