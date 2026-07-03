import type { DbAdapter } from '../types.js';

let adapter: DbAdapter;

export async function initDb(): Promise<void> {
  if (process.env.DATABASE_URL) {
    const { PostgresAdapter } = await import('./postgres.js');
    adapter = new PostgresAdapter(process.env.DATABASE_URL);
  } else {
    const { SqliteAdapter } = await import('./sqlite.js');
    adapter = new SqliteAdapter();
  }
  await adapter.init();
}

export async function query(sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
  return adapter.query(sql, params);
}

export async function get(sql: string, params: unknown[] = []): Promise<Record<string, unknown> | null> {
  return adapter.get(sql, params);
}
