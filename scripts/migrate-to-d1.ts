#!/usr/bin/env tsx
/**
 * One-time migration: filesystem + SQLite → Cloudflare D1 + R2
 * Run from project root:
 *   npx tsx scripts/migrate-to-d1.ts           (remote — production D1/R2)
 *   npx tsx scripts/migrate-to-d1.ts --local   (local — .wrangler/state, for wrangler pages dev)
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { DatabaseSync } from 'node:sqlite';

// Import schemas for annotation normalization (no SvelteKit deps)
import { AnnotationSchema, TextMetadataSchema } from '../src/lib/server/validation.js';

const CONTENT_DIR = resolve('content/texts');
const AUTHORS_DIR = resolve('content/authors');
const PAGES_DIR   = resolve('content/pages');
const DB_PATH     = resolve('data/teasys.db');

const LOCAL = process.argv.includes('--local');

const MIME: Record<string, string> = {
	jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp'
};

// Escape a value for use in a SQL literal
function sq(s: string | null | undefined): string {
	if (s === null || s === undefined) return 'NULL';
	return `'${String(s).replace(/'/g, "''")}'`;
}
function num(n: number | null | undefined): string {
	if (n === null || n === undefined) return 'NULL';
	return String(n);
}

async function main() {
	const statements: string[] = [];

	// ── 1. Users ──────────────────────────────────────────────────────────────
	console.log('Reading users from SQLite...');
	if (!existsSync(DB_PATH)) {
		console.error(`DB not found at ${DB_PATH}. Run: rsync -avz nicolai@nicolai.lol:/var/www/teasys/data/teasys.db ./data/`);
		process.exit(1);
	}
	const sqlite = new DatabaseSync(DB_PATH);
	const users = sqlite.prepare('SELECT * FROM users').all() as {
		id: number; username: string; password_hash: string; role: string; created_at: string;
	}[];
	for (const u of users) {
		statements.push(
			`INSERT OR IGNORE INTO users (id, username, password_hash, role, created_at) VALUES (${num(u.id)}, ${sq(u.username)}, ${sq(u.password_hash)}, ${sq(u.role)}, ${sq(u.created_at)});`
		);
	}
	console.log(`  → ${users.length} users`);

	// ── 2. Texts + annotations ────────────────────────────────────────────────
	console.log('Reading texts and annotations...');
	let textCount = 0;
	let annotationCount = 0;
	let skippedAnnotations = 0;

	const textDirs = (await readdir(CONTENT_DIR, { withFileTypes: true }))
		.filter(e => e.isDirectory()).map(e => e.name);

	for (const textId of textDirs) {
		const textDir = join(CONTENT_DIR, textId);

		// metadata.json
		let meta: ReturnType<typeof TextMetadataSchema.parse>;
		try {
			const raw = await readFile(join(textDir, 'metadata.json'), 'utf-8');
			meta = TextMetadataSchema.parse(JSON.parse(raw));
		} catch (e) {
			console.warn(`  Skipping text ${textId} (bad metadata):`, e);
			continue;
		}

		// text.txt
		let rawText = '';
		try { rawText = await readFile(join(textDir, 'text.txt'), 'utf-8'); } catch {}

		statements.push(
			`INSERT OR IGNORE INTO texts (id, title, author, year, category, type, parent_id, sort_order, raw_text, created_at, updated_at) VALUES (${sq(meta.id)}, ${sq(meta.title)}, ${sq(meta.author)}, ${num(meta.year)}, ${sq(meta.category)}, ${sq(meta.type)}, ${sq(meta.parentId)}, ${num(meta.order)}, ${sq(rawText)}, ${sq(meta.createdAt)}, ${sq(meta.updatedAt)});`
		);
		textCount++;

		// annotations/
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
						`INSERT OR IGNORE INTO annotations (id, text_id, anchor_text, anchor_start, anchor_end, authors, version, levels, cross_refs, created_at, updated_at) VALUES (${sq(ann.id)}, ${sq(textId)}, ${sq(ann.anchorText)}, ${num(ann.anchorStart)}, ${num(ann.anchorEnd)}, ${sq(JSON.stringify(ann.authors))}, ${num(ann.version)}, ${sq(JSON.stringify(ann.levels))}, ${sq(JSON.stringify(ann.crossRefs))}, ${sq(ann.createdAt)}, ${sq(ann.updatedAt)});`
					);
					annotationCount++;
				} catch (e) {
					console.warn(`  Skipping annotation ${file} in ${textId}:`, e);
					skippedAnnotations++;
				}
			}
		}
	}
	console.log(`  → ${textCount} texts, ${annotationCount} annotations${skippedAnnotations ? ` (${skippedAnnotations} skipped)` : ''}`);

	// ── 3. Authors ────────────────────────────────────────────────────────────
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

			// Find portrait file
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
				`INSERT OR IGNORE INTO authors (slug, name, bio_md, birth_year, death_year, photo_credit, photo_credit_url, portrait_key) VALUES (${sq(slug)}, ${sq(name)}, ${sq(bio)}, ${num(birthYear)}, ${num(deathYear)}, ${sq(photoCredit)}, ${sq(photoCreditUrl)}, ${sq(portraitKey)});`
			);
			authorCount++;
		}
	}
	console.log(`  → ${authorCount} authors, ${portraitsToUpload.length} portraits`);

	// ── 4. Pages ──────────────────────────────────────────────────────────────
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
					`INSERT OR IGNORE INTO pages (id, title, content_md, menu, parent, created_at, updated_at) VALUES (${sq(meta.id || slug)}, ${sq(meta.title)}, ${sq(content)}, ${meta.menu === false ? 0 : 1}, ${sq(meta.parent ?? null)}, ${sq(meta.createdAt)}, ${sq(meta.updatedAt)});`
				);
				pageCount++;
			} catch (e) {
				console.warn(`  Skipping page ${slug}:`, e);
			}
		}
	}
	console.log(`  → ${pageCount} pages`);

	// ── Write SQL file ────────────────────────────────────────────────────────
	const sqlFile = resolve('migration-data.sql');
	await writeFile(sqlFile, statements.join('\n'), 'utf-8');
	console.log(`\nWrote ${statements.length} statements to migration-data.sql`);

	// ── Apply to D1 ───────────────────────────────────────────────────────────
	const target = LOCAL ? 'local' : 'remote';
	console.log(`\nApplying to D1 (${target})...`);
	if (LOCAL) {
		// Ensure local schema exists first
		execSync('wrangler d1 execute teasys-db --local --file=schema.sql', { stdio: 'inherit' });
	}
	execSync(`wrangler d1 execute teasys-db --${target} --file=migration-data.sql`, { stdio: 'inherit' });
	console.log('✓ D1 done');

	// ── Upload portraits to R2 ────────────────────────────────────────────────
	if (portraitsToUpload.length > 0) {
		console.log('\nUploading portraits to R2...');
		for (const { slug, path: filePath, ext } of portraitsToUpload) {
			const key = `portraits/${slug}.${ext}`;
			process.stdout.write(`  ${key}... `);
			const localFlag = LOCAL ? ' --local' : '';
			execSync(
				`wrangler r2 object put teasys-portraits/${key} --file="${filePath}" --content-type="${MIME[ext]}"${localFlag}`,
				{ stdio: 'pipe' }
			);
			console.log('✓');
		}
	}

	console.log('\n✓ Migration complete!');
	console.log(`  Users: ${users.length}, Texts: ${textCount}, Annotations: ${annotationCount}, Authors: ${authorCount}, Pages: ${pageCount}`);
}

main().catch(e => {
	console.error('\nMigration failed:', e);
	process.exit(1);
});
