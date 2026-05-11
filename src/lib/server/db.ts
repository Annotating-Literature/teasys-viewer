import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

let _db: D1Database | null = null;

function createAdapter(sqlite: InstanceType<typeof DatabaseSync>): D1Database {
	const makeStmt = (sql: string) => {
		let _values: unknown[] = [];

		// node:sqlite StatementSync expects SQLInputValue (string | number | bigint | null | Uint8Array)
		// We cast here because our callers always pass compatible values.
		type SQLVal = string | number | bigint | null | Uint8Array;

		const self = {
			bind(...values: unknown[]) {
				_values = values as SQLVal[];
				return self;
			},
			async first<T = Record<string, unknown>>(): Promise<T | null> {
				return (sqlite.prepare(sql).get(...(_values as SQLVal[])) as T | null) ?? null;
			},
			async all<T = Record<string, unknown>>(): Promise<{ results: T[]; success: boolean }> {
				return { results: sqlite.prepare(sql).all(...(_values as SQLVal[])) as T[], success: true };
			},
			async run(): Promise<{ success: boolean; meta: Record<string, unknown> }> {
				const info = sqlite.prepare(sql).run(...(_values as SQLVal[]));
				return { success: true, meta: { changes: info.changes, last_row_id: info.lastInsertRowid } };
			},
		};
		return self as unknown as D1PreparedStatement;
	};

	return {
		prepare: (sql: string) => makeStmt(sql),
		batch: async (stmts: D1PreparedStatement[]) => {
			// Run all statements in a single transaction
			const run = sqlite.prepare('BEGIN');
			try {
				run.run();
				const results = await Promise.all(stmts.map((s) => (s as ReturnType<typeof makeStmt>).run()));
				sqlite.prepare('COMMIT').run();
				return results as D1Result[];
			} catch (e) {
				sqlite.prepare('ROLLBACK').run();
				throw e;
			}
		},
		exec: async (query: string) => {
			sqlite.exec(query);
			return { count: 0, duration: 0 };
		},
		dump: async () => new ArrayBuffer(0),
	} as unknown as D1Database;
}

export function getLocalDB(): D1Database {
	if (_db) return _db;
	const dbPath = resolve('data/teasys.db');
	const dir = dirname(dbPath);
	if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
	const sqlite = new DatabaseSync(dbPath);
	sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
	_db = createAdapter(sqlite);
	return _db;
}
