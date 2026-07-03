import pg from 'pg';

export class PostgresAdapter {
  constructor(url) {
    this.url = url;
  }

  async init() {
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

    const count = await this.pool.query('SELECT COUNT(*)::int as c FROM barbers');
    if (count.rows[0].c === 0) {
      await this.seed();
    }
  }

  async seed() {
    await this.query(`INSERT INTO barbers (name, bio) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      ['Marco Silva', 'Master barber with 15 years of experience. Specializes in fades and classic cuts.']);
    await this.query(`INSERT INTO barbers (name, bio) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      ['Lucas Costa', 'Modern styling specialist. Great with beards and textured hair.']);
    await this.query(`INSERT INTO barbers (name, bio) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      ['Rafael Oliveira', 'Traditional barbering expert. Hot towel shaves and precision cuts.']);

    await this.query(`INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ['Haircut', 'Classic haircut with scissors or clippers', 45, 30]);
    await this.query(`INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ['Beard Trim', 'Beard shaping and trimming with hot towel', 30, 20]);
    await this.query(`INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ['Haircut + Beard', 'Full haircut and beard grooming combo', 65, 45]);
    await this.query(`INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ['Hot Towel Shave', 'Traditional straight razor shave with hot towels', 55, 40]);
    await this.query(`INSERT INTO services (name, description, price, duration) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
      ['Kids Haircut', 'Haircut for children under 12', 35, 25]);

    for (let b = 1; b <= 3; b++) {
      for (let s = 1; s <= 4; s++) {
        await this.query(`INSERT INTO barber_services (barber_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [b, s]);
      }
    }

    for (let d = 0; d < 7; d++) {
      const closed = d === 0;
      await this.query(`INSERT INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [d, '09:00', '18:00', closed ? 1 : 0]);
    }
  }

  async query(sql, params = []) {
    const isInsert = /^\s*INSERT/i.test(sql);
    let finalSql = sql;

    if (isInsert && !/RETURNING/i.test(sql)) {
      finalSql = sql + ' RETURNING *';
    }

    const result = await this.pool.query(finalSql, params);
    const isSelect = /^\s*(SELECT|WITH)/i.test(sql);

    if (isSelect || isInsert) {
      return result.rows;
    }

    return { changes: result.rowCount, lastInsertRowid: null };
  }

  async get(sql, params = []) {
    const rows = await this.query(sql, params);
    return rows[0] || null;
  }
}
