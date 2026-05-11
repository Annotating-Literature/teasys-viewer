import { TextMetadataSchema, AnnotationSchema } from './validation';
import type { TextMetadata } from '$lib/types/text';
import type { Annotation } from '$lib/types/annotation';
import { generateTEI } from './teiGenerator';

export function isValidSlug(s: string) {
	return /^[a-z0-9-]+$/.test(s);
}

const MIME: Record<string, string> = {
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
};

// --- Row types ---

interface TextRow {
	id: string; title: string; author: string; year: number | null;
	category: string; type: string; parent_id: string | null;
	sort_order: number | null; raw_text: string; tei_xml: string | null;
	created_at: string; updated_at: string;
}

interface AnnotationRow {
	id: string; text_id: string; anchor_text: string;
	anchor_start: number; anchor_end: number; authors: string;
	version: number; levels: string; cross_refs: string;
	created_at: string; updated_at: string;
}

interface AuthorRow {
	slug: string; name: string; bio_md: string;
	birth_year: number | null; death_year: number | null;
	photo_credit: string | null; photo_credit_url: string | null;
	portrait_key: string | null;
}

// --- Mappers ---

function rowToMetadata(row: TextRow): TextMetadata {
	return TextMetadataSchema.parse({
		id: row.id, title: row.title, author: row.author,
		year: row.year ?? undefined, category: row.category,
		type: row.type, parentId: row.parent_id ?? undefined,
		order: row.sort_order ?? undefined,
		createdAt: row.created_at, updatedAt: row.updated_at,
	});
}

function rowToAnnotation(row: AnnotationRow): Annotation {
	return AnnotationSchema.parse({
		id: row.id,
		anchorText: row.anchor_text,
		anchorStart: row.anchor_start,
		anchorEnd: row.anchor_end,
		authors: JSON.parse(row.authors),
		version: row.version,
		levels: JSON.parse(row.levels),
		crossRefs: JSON.parse(row.cross_refs),
		createdAt: row.created_at,
		updatedAt: row.updated_at,
	});
}

// --- Texts ---

export async function listTexts(db: D1Database): Promise<TextMetadata[]> {
	const result = await db.prepare(
		'SELECT id, title, author, year, category, type, parent_id, sort_order, created_at, updated_at FROM texts ORDER BY title'
	).all<TextRow>();
	return result.results.map(rowToMetadata);
}

export async function getChildTexts(db: D1Database, parentId: string): Promise<TextMetadata[]> {
	if (!isValidSlug(parentId)) throw new Error('Invalid text ID');
	const result = await db.prepare(
		'SELECT id, title, author, year, category, type, parent_id, sort_order, created_at, updated_at FROM texts WHERE parent_id = ? ORDER BY sort_order'
	).bind(parentId).all<TextRow>();
	return result.results.map(rowToMetadata);
}

export async function getText(db: D1Database, textId: string): Promise<{ metadata: TextMetadata; rawText: string }> {
	if (!isValidSlug(textId)) throw new Error('Invalid text ID');
	const row = await db.prepare('SELECT * FROM texts WHERE id = ?').bind(textId).first<TextRow>();
	if (!row) throw new Error('Text not found');
	return { metadata: rowToMetadata(row), rawText: row.raw_text };
}

export async function getAnnotationCount(db: D1Database, textId: string): Promise<number> {
	if (!isValidSlug(textId)) throw new Error('Invalid text ID');
	const row = await db.prepare('SELECT COUNT(*) as n FROM annotations WHERE text_id = ?')
		.bind(textId).first<{ n: number }>();
	return row?.n ?? 0;
}

export async function listAnnotations(db: D1Database, textId: string): Promise<Annotation[]> {
	if (!isValidSlug(textId)) throw new Error('Invalid text ID');
	const result = await db.prepare(
		'SELECT * FROM annotations WHERE text_id = ? ORDER BY anchor_start'
	).bind(textId).all<AnnotationRow>();
	return result.results.map(rowToAnnotation);
}

export async function getAnnotation(db: D1Database, textId: string, annotationId: string): Promise<Annotation> {
	if (!isValidSlug(textId) || !isValidSlug(annotationId)) throw new Error('Invalid ID');
	const row = await db.prepare('SELECT * FROM annotations WHERE id = ? AND text_id = ?')
		.bind(annotationId, textId).first<AnnotationRow>();
	if (!row) throw new Error('Annotation not found');
	return rowToAnnotation(row);
}

type AnyContext = ExecutionContext | { waitUntil: (p: Promise<unknown>) => void };

export async function saveAnnotation(db: D1Database, context: AnyContext, textId: string, annotation: Annotation): Promise<void> {
	if (!isValidSlug(textId) || !isValidSlug(annotation.id)) throw new Error('Invalid ID');

	await db.prepare(`
		INSERT INTO annotations (id, text_id, anchor_text, anchor_start, anchor_end, authors, version, levels, cross_refs, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT(id, text_id) DO UPDATE SET
			anchor_text = excluded.anchor_text,
			anchor_start = excluded.anchor_start,
			anchor_end = excluded.anchor_end,
			authors = excluded.authors,
			version = excluded.version,
			levels = excluded.levels,
			cross_refs = excluded.cross_refs,
			updated_at = excluded.updated_at
	`).bind(
		annotation.id, textId, annotation.anchorText,
		annotation.anchorStart, annotation.anchorEnd,
		JSON.stringify(annotation.authors), annotation.version,
		JSON.stringify(annotation.levels), JSON.stringify(annotation.crossRefs),
		annotation.createdAt, annotation.updatedAt
	).run();

	context.waitUntil(generateTEI(db, textId));
}

export async function deleteAnnotation(db: D1Database, context: AnyContext, textId: string, annotationId: string): Promise<void> {
	if (!isValidSlug(textId) || !isValidSlug(annotationId)) throw new Error('Invalid ID');
	await db.prepare('DELETE FROM annotations WHERE id = ? AND text_id = ?')
		.bind(annotationId, textId).run();
	context.waitUntil(generateTEI(db, textId));
}

export async function saveTextMetadata(db: D1Database, metadata: TextMetadata): Promise<void> {
	const v = TextMetadataSchema.parse(metadata);
	await db.prepare(`
		INSERT INTO texts (id, title, author, year, category, type, parent_id, sort_order, raw_text, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
		ON CONFLICT(id) DO UPDATE SET
			title = excluded.title,
			author = excluded.author,
			year = excluded.year,
			category = excluded.category,
			type = excluded.type,
			parent_id = excluded.parent_id,
			sort_order = excluded.sort_order,
			updated_at = excluded.updated_at
	`).bind(
		v.id, v.title, v.author, v.year ?? null, v.category, v.type,
		v.parentId ?? null, v.order ?? null, v.createdAt, v.updatedAt
	).run();
}

export async function saveTextContent(db: D1Database, textId: string, text: string): Promise<void> {
	if (!isValidSlug(textId)) throw new Error('Invalid text ID');
	await db.prepare('UPDATE texts SET raw_text = ?, updated_at = ? WHERE id = ?')
		.bind(text, new Date().toISOString(), textId).run();
}

// --- Author Profiles ---

export interface AuthorProfile {
	bio: string;
	portraitPath: string | null;
	birthYear: number | null;
	deathYear: number | null;
	photoCredit: string | null;
	photoCreditUrl: string | null;
}

export async function getAuthorProfile(db: D1Database, slug: string): Promise<AuthorProfile | null> {
	if (!isValidSlug(slug)) throw new Error('Invalid author slug');
	const row = await db.prepare('SELECT bio_md, birth_year, death_year, photo_credit, photo_credit_url, portrait_key FROM authors WHERE slug = ?').bind(slug).first<AuthorRow>();
	if (!row) return null;
	return {
		bio: row.bio_md,
		portraitPath: row.portrait_key ? `/api/authors/${slug}/portrait` : null,
		birthYear: row.birth_year ?? null,
		deathYear: row.death_year ?? null,
		photoCredit: row.photo_credit ?? null,
		photoCreditUrl: row.photo_credit_url ?? null,
	};
}

export async function saveAuthorProfile(db: D1Database, slug: string, bio: string): Promise<void> {
	if (!isValidSlug(slug)) throw new Error('Invalid author slug');
	await db.prepare('UPDATE authors SET bio_md = ? WHERE slug = ?').bind(bio, slug).run();
}

export async function saveAuthorMetadata(db: D1Database, slug: string, fields: {
	birthYear?: number | null;
	deathYear?: number | null;
	photoCredit?: string | null;
	photoCreditUrl?: string | null;
}): Promise<void> {
	if (!isValidSlug(slug)) throw new Error('Invalid author slug');
	await db.prepare(`
		UPDATE authors SET
			birth_year = ?,
			death_year = ?,
			photo_credit = ?,
			photo_credit_url = ?
		WHERE slug = ?
	`).bind(
		fields.birthYear ?? null,
		fields.deathYear ?? null,
		fields.photoCredit ?? null,
		fields.photoCreditUrl ?? null,
		slug
	).run();
}

export async function createAuthor(db: D1Database, name: string): Promise<string> {
	const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	await db.prepare('INSERT OR IGNORE INTO authors (slug, name, bio_md) VALUES (?, ?, ?)').bind(slug, name, '').run();
	return slug;
}

export async function listAuthorDirectories(db: D1Database): Promise<{ slug: string; name: string }[]> {
	const result = await db.prepare('SELECT slug, name FROM authors ORDER BY name').all<{ slug: string; name: string }>();
	return result.results;
}

export async function saveAuthorPortrait(bucket: R2Bucket, db: D1Database, slug: string, data: Buffer, ext: string): Promise<void> {
	const key = `portraits/${slug}.${ext}`;

	const existing = await db.prepare('SELECT portrait_key FROM authors WHERE slug = ?')
		.bind(slug).first<{ portrait_key: string | null }>();
	const oldKey = existing?.portrait_key;

	// Upload new portrait and delete old one (if different key) in parallel
	await Promise.all([
		bucket.put(key, data, { httpMetadata: { contentType: MIME[ext] ?? 'image/jpeg' } }),
		oldKey && oldKey !== key ? bucket.delete(oldKey) : Promise.resolve(),
	]);
	await db.prepare('UPDATE authors SET portrait_key = ? WHERE slug = ?').bind(key, slug).run();
}

export async function getAuthorPortraitFile(bucket: R2Bucket, db: D1Database, slug: string): Promise<{ data: ArrayBuffer; ext: string } | null> {
	const row = await db.prepare('SELECT portrait_key FROM authors WHERE slug = ?')
		.bind(slug).first<{ portrait_key: string | null }>();
	if (!row?.portrait_key) return null;

	const obj = await bucket.get(row.portrait_key);
	if (!obj) return null;

	const ext = row.portrait_key.split('.').pop() ?? 'jpg';
	return { data: await obj.arrayBuffer(), ext };
}
