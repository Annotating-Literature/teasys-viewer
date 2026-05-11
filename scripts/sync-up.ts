#!/usr/bin/env tsx
/**
 * Sync local content/ directory up to remote D1.
 * Overwrites existing records (INSERT OR REPLACE) so edits to local files
 * are reflected in production.
 *
 * Run from project root:
 *   npx tsx scripts/sync-up.ts              (remote — production D1)
 *   npx tsx scripts/sync-up.ts --local      (local wrangler dev DB)
 *
 * Does NOT touch the users or sessions tables.
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

import { AnnotationSchema, TextMetadataSchema } from '../src/lib/server/validation.js';

const TEXTS_DIR   = resolve('content/texts');
const AUTHORS_DIR = resolve('content/authors');
const PAGES_DIR   = resolve('content/pages');

const LOCAL = process.argv.includes('--local');
const TARGET = LOCAL ? 'local' : 'remote';

const MIME: Record<string, string> = {
	jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
};

function sq(s: string | null | undefined): string {
	if (s === null || s === undefined) return 'NULL';
	return `'${String(s).replace(/'/g, "''")}'`;
}
function num(n: number | null | undefined): string {
	if (n === null || n === undefined) return 'NULL';
	return String(n);
}

async function main() {
	console.log(`Syncing local content/ → D1 (${TARGET})...\n`);

	const statements: string[] = [];

	// ── Texts + Annotations ───────────────────────────────────────────────────
	console.log('Reading texts and annotations...');
	let textCount = 0;
	let annotationCount = 0;
	let skipped = 0;

	const textDirs = (await readdir(TEXTS_DIR, { withFileTypes: true }))
		.filter(e => e.isDirectory()).map(e => e.name);

	for (const textId of textDirs) {
		const textDir = join(TEXTS_DIR, textId);

		let meta: ReturnType<typeof TextMetadataSchema.parse>;
		try {
			const parsed = JSON.parse(await readFile(join(textDir, 'metadata.json'), 'utf-8'));
			// Zod optional() rejects null — strip nulls so sync-down's null values parse cleanly
			for (const key of Object.keys(parsed)) {
				if (parsed[key] === null) delete parsed[key];
			}
			meta = TextMetadataSchema.parse(parsed);
		} catch (e) {
			console.warn(`  Skipping text ${textId} (bad metadata):`, e);
			skipped++;
			continue;
		}

		let rawText = '';
		try { rawText = await readFile(join(textDir, 'text.txt'), 'utf-8'); } catch {}

		statements.push(
			`INSERT OR REPLACE INTO texts (id, title, author, year, category, type, parent_id, sort_order, raw_text, created_at, updated_at) VALUES (${sq(meta.id)}, ${sq(meta.title)}, ${sq(meta.author)}, ${num(meta.year)}, ${sq(meta.category)}, ${sq(meta.type)}, ${sq(meta.parentId)}, ${num(meta.order)}, ${sq(rawText)}, ${sq(meta.createdAt)}, ${sq(meta.updatedAt)});`
		);
		textCount++;

		const annDir = join(textDir, 'annotations');
		if (existsSync(annDir)) {
			const files = (await readdir(annDir)).filter(f => f.endsWith('.json'));
			for (const file of files) {
				try {
					const raw = await readFile(join(annDir, file), 'utf-8');
					const data = JSON.parse(raw);
					if (data.version === undefined) data.version = 1;
					const ann = AnnotationSchema.parse(data);
					statements.push(
						`INSERT OR REPLACE INTO annotations (id, text_id, anchor_text, anchor_start, anchor_end, authors, version, levels, cross_refs, created_at, updated_at) VALUES (${sq(ann.id)}, ${sq(textId)}, ${sq(ann.anchorText)}, ${num(ann.anchorStart)}, ${num(ann.anchorEnd)}, ${sq(JSON.stringify(ann.authors))}, ${num(ann.version)}, ${sq(JSON.stringify(ann.levels))}, ${sq(JSON.stringify(ann.crossRefs))}, ${sq(ann.createdAt)}, ${sq(ann.updatedAt)});`
					);
					annotationCount++;
				} catch (e) {
					console.warn(`  Skipping annotation ${file} in ${textId}:`, e);
					skipped++;
				}
			}
		}
	}
	console.log(`  → ${textCount} texts, ${annotationCount} annotations${skipped ? ` (${skipped} skipped)` : ''}`);

	// ── Authors ───────────────────────────────────────────────────────────────
	console.log('Reading authors...');
	let authorCount = 0;
	const portraitsToUpload: { slug: string; path: string; ext: string }[] = [];

	if (existsSync(AUTHORS_DIR)) {
		const authorDirs = (await readdir(AUTHORS_DIR, { withFileTypes: true }))
			.filter(e => e.isDirectory()).map(e => e.name);

		for (const slug of authorDirs) {
			const authorDir = join(AUTHORS_DIR, slug);

			let name = slug;
			let birthYear: number | null = null;
			let deathYear: number | null = null;
			let photoCredit: string | null = null;
			let photoCreditUrl: string | null = null;
			try {
				const meta = JSON.parse(await readFile(join(authorDir, 'metadata.json'), 'utf-8'));
				name = meta.name || slug;
				birthYear = meta.birthYear ?? null;
				deathYear = meta.deathYear ?? null;
				photoCredit = meta.photoCredit ?? null;
				photoCreditUrl = meta.photoCreditUrl ?? null;
			} catch {}

			let bio = '';
			try { bio = await readFile(join(authorDir, 'bio.md'), 'utf-8'); } catch {}

			let portraitKey: string | null = null;
			for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
				const filePath = join(authorDir, `portrait.${ext}`);
				if (existsSync(filePath)) {
					portraitKey = `portraits/${slug}.${ext}`;
					portraitsToUpload.push({ slug, path: filePath, ext });
					break;
				}
			}

			statements.push(
				`INSERT OR REPLACE INTO authors (slug, name, bio_md, birth_year, death_year, photo_credit, photo_credit_url, portrait_key) VALUES (${sq(slug)}, ${sq(name)}, ${sq(bio)}, ${num(birthYear)}, ${num(deathYear)}, ${sq(photoCredit)}, ${sq(photoCreditUrl)}, ${sq(portraitKey)});`
			);
			authorCount++;
		}
	}
	console.log(`  → ${authorCount} authors`);

	// ── Pages ─────────────────────────────────────────────────────────────────
	console.log('Reading pages...');
	let pageCount = 0;

	if (existsSync(PAGES_DIR)) {
		const pageDirs = (await readdir(PAGES_DIR, { withFileTypes: true }))
			.filter(e => e.isDirectory()).map(e => e.name);

		for (const slug of pageDirs) {
			const pageDir = join(PAGES_DIR, slug);
			try {
				const meta = JSON.parse(await readFile(join(pageDir, 'metadata.json'), 'utf-8'));
				let content = '';
				try { content = await readFile(join(pageDir, 'content.md'), 'utf-8'); } catch {}

				statements.push(
					`INSERT OR REPLACE INTO pages (id, title, content_md, menu, parent, created_at, updated_at) VALUES (${sq(meta.id || slug)}, ${sq(meta.title)}, ${sq(content)}, ${meta.menu === false ? 0 : 1}, ${sq(meta.parent ?? null)}, ${sq(meta.createdAt)}, ${sq(meta.updatedAt)});`
				);
				pageCount++;
			} catch (e) {
				console.warn(`  Skipping page ${slug}:`, e);
			}
		}
	}
	console.log(`  → ${pageCount} pages`);

	// ── Apply to D1 ───────────────────────────────────────────────────────────
	const sqlFile = resolve('.tmp-sync-up.sql');
	const { writeFile, unlink } = await import('node:fs/promises');
	await writeFile(sqlFile, statements.join('\n'), 'utf-8');

	console.log(`\nApplying ${statements.length} statements to D1 (${TARGET})...`);
	try {
		execSync(`wrangler d1 execute teasys-db --${TARGET} --file=${sqlFile}`, { stdio: 'inherit' });
	} finally {
		await unlink(sqlFile).catch(() => {});
	}
	console.log('✓ D1 done');

	// ── Upload portraits to R2 ────────────────────────────────────────────────
	if (portraitsToUpload.length > 0) {
		console.log('\nUploading portraits to R2...');
		for (const { path: filePath, ext } of portraitsToUpload) {
			const key = `portraits/${filePath.split('/').pop()?.replace(/\.[^.]+$/, '')}.${ext}`;
			process.stdout.write(`  ${key}... `);
			const localFlag = LOCAL ? ' --local' : '';
			try {
				execSync(
					`wrangler r2 object put teasys-portraits/${key} --file="${filePath}" --content-type="${MIME[ext]}"${localFlag}`,
					{ stdio: 'pipe' }
				);
				console.log('✓');
			} catch (e) {
				console.log('✗');
				console.error(e);
			}
		}
	}

	console.log(`\n✓ Sync-up complete! Texts: ${textCount}, Annotations: ${annotationCount}, Authors: ${authorCount}, Pages: ${pageCount}`);
}

main().catch(e => {
	console.error('\nSync-up failed:', e);
	process.exit(1);
});
