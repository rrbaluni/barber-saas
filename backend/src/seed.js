import { initDb, query } from './db/index.js';

await initDb();

const seeds = [
  () => query('INSERT OR IGNORE INTO barbers (name, bio) VALUES (?, ?)', ['Marco Silva', 'Master barber with 15 years of experience. Specializes in fades and classic cuts.']),
  () => query('INSERT OR IGNORE INTO barbers (name, bio) VALUES (?, ?)', ['Lucas Costa', 'Modern styling specialist. Great with beards and textured hair.']),
  () => query('INSERT OR IGNORE INTO barbers (name, bio) VALUES (?, ?)', ['Rafael Oliveira', 'Traditional barbering expert. Hot towel shaves and precision cuts.']),
  () => query('INSERT OR IGNORE INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)', ['Haircut', 'Classic haircut with scissors or clippers', 45, 30]),
  () => query('INSERT OR IGNORE INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)', ['Beard Trim', 'Beard shaping and trimming with hot towel', 30, 20]),
  () => query('INSERT OR IGNORE INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)', ['Haircut + Beard', 'Full haircut and beard grooming combo', 65, 45]),
  () => query('INSERT OR IGNORE INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)', ['Hot Towel Shave', 'Traditional straight razor shave with hot towels', 55, 40]),
  () => query('INSERT OR IGNORE INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)', ['Kids Haircut', 'Haircut for children under 12', 35, 25]),
];

for (const s of seeds) await s();

for (let b = 1; b <= 3; b++) {
  for (let s = 1; s <= 4; s++) {
    await query('INSERT OR IGNORE INTO barber_services (barber_id, service_id) VALUES (?, ?)', [b, s]);
  }
}

for (let d = 0; d < 7; d++) {
  const closed = d === 0;
  await query('INSERT OR IGNORE INTO business_hours (day_of_week, open_time, close_time, is_closed) VALUES (?, ?, ?, ?)', [d, '09:00', '18:00', closed ? 1 : 0]);
}

console.log('Database seeded successfully!');
process.exit(0);
