import type { PageMetadata } from '$lib/types/page';

interface PageRow {
	id: string;
	title: string;
	content_md: string;
	menu: number;
	parent: string | null;
	sort_order: number | null;
	created_at: string;
	updated_at: string;
}

function rowToMetadata(row: PageRow): PageMetadata {
	return {
		id: row.id,
		title: row.title,
		menu: row.menu === 1,
		parent: row.parent ?? undefined,
		sortOrder: row.sort_order ?? undefined,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	};
}

export async function listPages(db: D1Database): Promise<PageMetadata[]> {
	// Sort within each parent group: top-level pages first (null parent), then children grouped by parent.
	// Within each group, sort by sort_order then title.
	const result = await db.prepare(
		'SELECT id, title, menu, parent, sort_order, created_at, updated_at FROM pages ORDER BY COALESCE(parent, \'\'), COALESCE(sort_order, 999999), title'
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

	const row = await db.prepare(`
		INSERT INTO pages (id, title, content_md, menu, parent, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			title = excluded.title,
			content_md = excluded.content_md,
			menu = excluded.menu,
			parent = excluded.parent,
			updated_at = excluded.updated_at
		RETURNING created_at, sort_order
	`).bind(slug, title, content, menu ? 1 : 0, parent || null, now, now).first<{ created_at: string; sort_order: number | null }>();

	return {
		id: slug,
		title,
		menu,
		parent: parent || undefined,
		sortOrder: row!.sort_order ?? undefined,
		createdAt: row!.created_at,
		updatedAt: now,
	};
}

export async function movePage(db: D1Database, slug: string, direction: 'up' | 'down'): Promise<void> {
	const pages = await listPages(db);
	const page = pages.find(p => p.id === slug);
	if (!page) return;

	// Only reorder within the same parent group (null parent = top-level)
	const group = pages.filter(p => p.parent === page.parent);
	const idx = group.findIndex(p => p.id === slug);
	const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
	if (targetIdx < 0 || targetIdx >= group.length) return;

	// Normalise sort_order values for this group, then swap the two positions
	const ordered = group.map((p, i) => ({ id: p.id, order: i }));
	[ordered[idx].order, ordered[targetIdx].order] = [ordered[targetIdx].order, ordered[idx].order];

	const stmts = ordered.map(({ id, order }) =>
		db.prepare('UPDATE pages SET sort_order = ? WHERE id = ?').bind(order, id)
	);
	await db.batch(stmts);
}

export async function deletePage(db: D1Database, slug: string): Promise<void> {
	await db.prepare('DELETE FROM pages WHERE id = ?').bind(slug).run();
}
