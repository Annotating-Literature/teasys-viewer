#!/usr/bin/env tsx
/**
 * Pull remote D1 data into local dev environment.
 * Run from project root: npx tsx scripts/db-pull.ts
 */

import { execSync } from 'node:child_process';
import { unlinkSync } from 'node:fs';

const TMP = '.tmp-pull.sql';

console.log('Exporting remote D1...');
execSync(`wrangler d1 export teasys-db --remote --no-schema --output=${TMP}`, { stdio: 'inherit' });

console.log('\nClearing local tables...');
execSync(
	`wrangler d1 execute teasys-db --local --command="DELETE FROM annotations; DELETE FROM sessions; DELETE FROM texts; DELETE FROM pages; DELETE FROM authors; DELETE FROM users;"`,
	{ stdio: 'inherit' }
);

console.log('\nImporting into local D1...');
execSync(`wrangler d1 execute teasys-db --local --file=${TMP}`, { stdio: 'inherit' });

unlinkSync(TMP);
console.log('\n✓ Local DB is now in sync with remote.');
