import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', '..', 'data.db');

export class SqliteAdapter {
  async init() {
    const SQL = await initSqlJs();

    if (existsSync(DB_PATH)) {
      this.db = new SQL.Database(readFileSync(DB_PATH));
    } else {
      this.db = new SQL.Database();
    }

    this.db.run('PRAGMA foreign_keys = ON');

    this.db.run(`CREATE TABLE IF NOT EXISTS barbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, bio TEXT,
      image TEXT, active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )`);

    this.db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT,
      price REAL NOT NULL, duration INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )`);

    this.db.run(`CREATE TABLE IF NOT EXISTS barber_services (
      barber_id INTEGER NOT NULL, service_id INTEGER NOT NULL,
      PRIMARY KEY (barber_id, service_id),
      FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
    )`);

    this.db.run(`CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT, barber_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL, customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL, customer_phone TEXT, date TEXT NOT NULL,
      time TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'confirmed', notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (barber_id) REFERENCES barbers(id),
      FOREIGN KEY (service_id) REFERENCES services(id)
    )`);

    this.db.run(`CREATE TABLE IF NOT EXISTS time_off (
      id INTEGER PRIMARY KEY AUTOINCREMENT, barber_id INTEGER NOT NULL,
      date TEXT NOT NULL, start_time TEXT, end_time TEXT, reason TEXT,
      FOREIGN KEY (barber_id) REFERENCES barbers(id) ON DELETE CASCADE
    )`);

    this.db.run(`CREATE TABLE IF NOT EXISTS business_hours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
      open_time TEXT NOT NULL, close_time TEXT NOT NULL, is_closed INTEGER NOT NULL DEFAULT 0
    )`);

    this.save();
  }

  save() {
    const data = this.db.export();
    writeFileSync(DB_PATH, Buffer.from(data));
  }

  query(sql, params = []) {
    const stmt = this.db.prepare(sql);
    const isSelect = /^\s*(SELECT|WITH)/i.test(sql);

    if (isSelect) {
      stmt.bind(params);
      const rows = [];
      while (stmt.step()) rows.push(stmt.getAsObject());
      stmt.free();
      return rows;
    }

    stmt.run(params);
    stmt.free();
    this.save();
    return { changes: this.db.getRowsModified(), lastInsertRowid: null };
  }

  get(sql, params = []) {
    const rows = this.query(sql, params);
    return rows[0] || null;
  }
}
