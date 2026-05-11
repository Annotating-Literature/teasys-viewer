#!/usr/bin/env tsx
/**
 * Sync data from remote D1 database back to local content/ directory.
 * Run from project root: npx tsx scripts/sync-down.ts
 */

import { execSync } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const CONTENT_DIR = resolve('content');
const TEXTS_DIR = join(CONTENT_DIR, 'texts');
const AUTHORS_DIR = join(CONTENT_DIR, 'authors');
const PAGES_DIR = join(CONTENT_DIR, 'pages');

async function fetchTable(tableName: string) {
	console.log(`Fetching ${tableName} from remote D1...`);
	let output: string;
	try {
		output = execSync(`wrangler d1 execute teasys-db --remote --command="SELECT * FROM ${tableName}" --json`, {
			encoding: 'utf-8',
			maxBuffer: 50 * 1024 * 1024,
		});
	} catch (e: any) {
		// execSync throws on non-zero exit — try to extract a helpful message from wrangler's stdout
		const stdout: string = e.stdout || '';
		try {
			const errJson = JSON.parse(stdout);
			const code: number | undefined = errJson?.error?.code;
			const text: string = errJson?.error?.text || 'Unknown error';
			if (code === 7403) {
				throw new Error(`Cloudflare auth failed (code 7403): ${text}\n  → Run: wrangler login`);
			}
			throw new Error(`D1 query failed for table "${tableName}": ${text} (code ${code})`);
		} catch (parseErr) {
			if (parseErr instanceof Error && parseErr.message.includes('D1 query failed')) throw parseErr;
			if (parseErr instanceof Error && parseErr.message.includes('Cloudflare auth')) throw parseErr;
			throw new Error(`Command failed for table "${tableName}": ${e.message}`);
		}
	}

	try {
		const parsed = JSON.parse(output);
		if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].results) {
			return parsed[0].results;
		}
		return [];
	} catch (e) {
		console.error(`Failed to parse output for ${tableName}:`, e);
		return [];
	}
}

async function main() {
	console.log('Starting sync-down from Remote D1 to local filesystem...\n');

	// Ensure base directories exist
	await mkdir(TEXTS_DIR, { recursive: true });
	await mkdir(AUTHORS_DIR, { recursive: true });
	await mkdir(PAGES_DIR, { recursive: true });

	// ── 1. Texts and Annotations ──────────────────────────────────────────────
	const texts = await fetchTable('texts');
	const annotations = await fetchTable('annotations');

	console.log(`\nWriting ${texts.length} texts to filesystem...`);
	for (const text of texts) {
		const textDir = join(TEXTS_DIR, text.id);
		await mkdir(textDir, { recursive: true });

		const metadata = {
			id: text.id,
			title: text.title,
			author: text.author,
			year: text.year,
			category: text.category,
			type: text.type,
			parentId: text.parent_id,
			order: text.sort_order,
			createdAt: text.created_at,
			updatedAt: text.updated_at,
		};

		await writeFile(join(textDir, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n', 'utf-8');
		await writeFile(join(textDir, 'text.txt'), text.raw_text || '', 'utf-8');

		// Handle annotations for this text
		const textAnns = annotations.filter((a: any) => a.text_id === text.id);
		const annDir = join(textDir, 'annotations');
		
		if (textAnns.length > 0) {
			// Clear existing annotations in the filesystem for this text to remove stale/deleted ones
			await rm(annDir, { recursive: true, force: true });
			await mkdir(annDir, { recursive: true });

			for (const ann of textAnns) {
				const annData = {
					id: ann.id,
					anchorText: ann.anchor_text,
					anchorStart: ann.anchor_start,
					anchorEnd: ann.anchor_end,
					authors: typeof ann.authors === 'string' ? JSON.parse(ann.authors) : ann.authors,
					version: ann.version,
					levels: typeof ann.levels === 'string' ? JSON.parse(ann.levels) : ann.levels,
					crossRefs: typeof ann.cross_refs === 'string' ? JSON.parse(ann.cross_refs) : ann.cross_refs,
					createdAt: ann.created_at,
					updatedAt: ann.updated_at,
				};
				await writeFile(join(annDir, `${ann.id}.json`), JSON.stringify(annData, null, 2) + '\n', 'utf-8');
			}
		} else {
			// If there are no annotations in D1, clean the local folder to reflect it
			await rm(annDir, { recursive: true, force: true });
		}
	}

	// ── 2. Authors ────────────────────────────────────────────────────────────
	const authors = await fetchTable('authors');
	console.log(`Writing ${authors.length} authors to filesystem...`);
	for (const author of authors) {
		const authorDir = join(AUTHORS_DIR, author.slug);
		await mkdir(authorDir, { recursive: true });

		const metadata = {
			name: author.name,
			birthYear: author.birth_year,
			deathYear: author.death_year,
			photoCredit: author.photo_credit,
			photoCreditUrl: author.photo_credit_url,
		};

		await writeFile(join(authorDir, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n', 'utf-8');
		await writeFile(join(authorDir, 'bio.md'), author.bio_md || '', 'utf-8');

		if (author.portrait_key) {
			const ext = author.portrait_key.split('.').pop();
			const destFile = join(authorDir, `portrait.${ext}`);
			process.stdout.write(`  Downloading portrait for ${author.slug}... `);
			try {
				execSync(`wrangler r2 object get teasys-portraits/${author.portrait_key} --file="${destFile}"`, {
					stdio: 'pipe'
				});
				console.log('✓');
			} catch (e) {
				console.log('✗ (Failed)');
				console.error(e);
			}
		}
	}

	// ── 3. Pages ──────────────────────────────────────────────────────────────
	const pages = await fetchTable('pages');
	console.log(`Writing ${pages.length} pages to filesystem...`);
	for (const page of pages) {
		const pageDir = join(PAGES_DIR, page.id);
		await mkdir(pageDir, { recursive: true });

		const metadata = {
			id: page.id,
			title: page.title,
			menu: page.menu === 1,
			parent: page.parent,
			createdAt: page.created_at,
			updatedAt: page.updated_at,
		};

		await writeFile(join(pageDir, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n', 'utf-8');
		await writeFile(join(pageDir, 'content.md'), page.content_md || '', 'utf-8');
	}

	console.log('\n✓ Sync-down complete!');
}

main().catch(e => {
	console.error('\nSync-down failed:', e);
	process.exit(1);
});