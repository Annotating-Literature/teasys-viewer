import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';

const args = process.argv.slice(2);
const usernameArg = args.find(a => a.startsWith('--username='));
const passwordArg = args.find(a => a.startsWith('--password='));

if (!usernameArg || !passwordArg) {
  console.error('Usage: ts-node seed-admin.ts --username=<admin> --password=<pass>');
  process.exit(1);
}

const username = usernameArg.split('=')[1];
const password = passwordArg.split('=')[1];

async function seed() {
  const dbPath = path.resolve('data', 'teasys.db');
  const db = new Database(dbPath);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role     TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const hash = await bcrypt.hash(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)');
    stmt.run(username, hash, 'admin');
    console.log(`Successfully created admin user: ${username}`);
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      console.error(`User ${username} already exists.`);
    } else {
      console.error(err);
    }
  }
}

seed();
