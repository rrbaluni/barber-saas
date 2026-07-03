import pg from 'pg';
import type { DbAdapter } from '../types.js';

export class PostgresAdapter implements DbAdapter {
  private pool!: pg.Pool;

  constructor(private readonly url: string) {}

  async init(): Promise<void> {
    this.pool = new pg.Pool({ connectionString: this.url, ssl: { rejectUnauthorized: false } });

    await this.pool.query(`CREATE TABLE IF NOT EXISTS barbers (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, bio TEXT,
      image TEXT, active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (NOW())
    )`);
    await this.pool.query(`CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY, name TEXT NOT NULL, description TEXT,
      price REAL NOT NULL, duration INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (NOW())
    )`);
    await this.pool.query(`CREATE TABLE IF NOT EXISTS barber_services (
      barber_id INTEGER NOT NULL, service_id INTEGER NOT NULL,
      PRIMARY KEY (barber_id, service_id),
      FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    )`);
    await this.pool.query(`CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY, barber_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL, customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL, customer_phone TEXT, date TEXT NOT NULL,
      time TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'confirmed', notes TEXT,
      created_at TEXT DEFAULT (NOW()),
      FOREIGN KEY (barber_id) REFERENCES barbers(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    )`);
    await this.pool.query(`CREATE TABLE IF NOT EXISTS time_off (
      id SERIAL PRIMARY KEY, barber_id INTEGER NOT NULL,
      date TEXT NOT NULL, start_time TEXT, end_time TEXT, reason TEXT,
      FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
    )`);
    await this.pool.query(`CREATE TABLE IF NOT EXISTS business_hours (
      id SERIAL PRIMARY KEY,
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      open_time TEXT NOT NULL, close_time TEXT NOT NULL, is_closed INTEGER NOT NULL DEFAULT 0
    )`);

    const { rows } = await this.pool.query('SELECT COUNT(*)::int as c FROM barbers');
    if (rows[0]?.c === 0) await this.seed();
  }

  private async seed(): Promise<void> {
    const seeds = [
      this.query('INSERT INTO barbers (name, bio) VALUES ($1, $2) ON CONFLICT DO NOTHING', ['Marco Silva', 'Master barber with 15 years of experience.']),
      this.query('INSERT INTO barbers (name, bio) VALUES ($1, $2) ON CONFLICT DO NOTHING', ['Lucas Costa', 'Modern styling specialist.']),
      this.query('INSERT INTO barbers (name, bio) VALUES ($1, $2) ON CONFLICT DO NOTHING', ['Rafael Oliveira', 'Traditional barbering expert.']),
      this.query('INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', ['Haircut', 'Classic haircut', 45, 30]),
      this.query('INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', ['Beard Trim', 'Beard shaping', 30, 20]),
      this.query('INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', ['Haircut + Beard', 'Full combo', 65, 45]),
      this.query('INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', ['Hot Towel Shave', 'Straight razor shave', 55, 40]),
      this.query('INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', ['Kids Haircut', 'Under 12', 35, 25]),
    ];
    await Promise.all(seeds);
    for (let b = 1; b <= 3; b++)
      for (let s = 1; s <= 4; s++)
        await this.query('INSERT INTO barber_services (barber_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [b, s]);
    for (let d = 0; d < 7; d++)
      await this.query('INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [d, '09:00', '18:00', d === 0 ? 1 : 0]);
  }

  async query(sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> {
    const isInsert = /^\s*INSERT/i.test(sql);
    const finalSql = isInsert && !/RETURNING/i.test(sql) ? sql + ' RETURNING *' : sql;
    const result = await this.pool.query(finalSql, params);
    if (/^\s*(SELECT|WITH)/i.test(sql) || isInsert) return result.rows as Record<string, unknown>[];
    return [{ changes: result.rowCount ?? 0 }];
  }

  async get(sql: string, params: unknown[] = []): Promise<Record<string, unknown> | null> {
    const rows = await this.query(sql, params);
    return rows[0] ?? null;
  }
}
