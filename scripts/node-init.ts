#!/usr/bin/env tsx
/**
 * Initialize the SQLite database for Node.js / PM2 deployments.
 * Run from the project root after building:
 *   npx tsx scripts/node-init.ts
 *
 * Optionally seed an admin user:
 *   npx tsx scripts/node-init.ts --username=admin --password=changeme
 */

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import bcrypt from 'bcryptjs';

const DB_PATH = resolve('data/teasys.db');
const SCHEMA_PATH = resolve('schema.sql');

const args = process.argv.slice(2);
const usernameArg = args.find((a) => a.startsWith('--username='));
const passwordArg = args.find((a) => a.startsWith('--password='));

if (!existsSync(resolve('data'))) {
	mkdirSync(resolve('data'), { recursive: true });
}

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');

console.log('Applying schema...');
const schema = readFileSync(SCHEMA_PATH, 'utf-8');
db.exec(schema);
console.log('✓ Schema applied');

if (usernameArg && passwordArg) {
	const username = usernameArg.split('=')[1];
	const password = passwordArg.split('=')[1];

	console.log(`Creating admin user: ${username}`);
	const hash = await bcrypt.hash(password, 10);
	try {
		db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, 'admin');
		console.log(`✓ Admin user created: ${username}`);
	} catch (err: any) {
		if (err.message?.includes('UNIQUE constraint failed')) {
			console.log(`User "${username}" already exists — skipped`);
		} else {
			throw err;
		}
	}
}

db.close();
console.log('\n✓ Node DB initialized at', DB_PATH);
console.log('  Build the app: ADAPTER=node npm run build:node');
console.log('  Start with PM2: pm2 start ecosystem.config.cjs');
console.log('  Or directly:    node build/index.js');
