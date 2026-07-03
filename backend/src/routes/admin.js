import { Router } from 'express';
import { query, get } from '../db/index.js';

const router = Router();

router.get('/bookings', async (req, res) => {
  const { date } = req.query;
  let sql = `
    SELECT b.*, br.name as barber_name, s.name as service_name, s.price
    FROM bookings b
    JOIN barbers br ON br.id = b.barber_id
    JOIN services s ON s.id = b.service_id
  `;
  const params = [];

  if (date) {
    sql += ' WHERE b.date = ?';
    params.push(date);
  }

  sql += ' ORDER BY b.date DESC, b.time DESC';
  res.json(await query(sql, params));
});

router.patch('/bookings/:id/status', async (req, res) => {
  const { status } = req.body;
  const valid = ['confirmed', 'completed', 'cancelled', 'no-show'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  await query('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
  res.json({ message: 'Status updated' });
});

router.post('/barbers', async (req, res) => {
  const { name, bio } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  await query('INSERT INTO barbers (name, bio) VALUES (?, ?)', [name, bio || null]);
  const barber = await get('SELECT * FROM barbers ORDER BY id DESC LIMIT 1');
  res.status(201).json(barber);
});

router.patch('/barbers/:id', async (req, res) => {
  const { name, bio, active } = req.body;
  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
  if (active !== undefined) { updates.push('active = ?'); params.push(active); }

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

  params.push(req.params.id);
  await query(`UPDATE barbers SET ${updates.join(', ')} WHERE id = ?`, params);
  res.json(await get('SELECT * FROM barbers WHERE id = ?', [req.params.id]));
});

router.post('/services', async (req, res) => {
  const { name, description, price, duration } = req.body;
  if (!name || price === undefined || !duration) return res.status(400).json({ error: 'Missing required fields' });

  await query('INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
    [name, description || null, price, duration]);

  res.status(201).json(await get('SELECT * FROM services ORDER BY id DESC LIMIT 1'));
});

router.patch('/services/:id', async (req, res) => {
  const { name, description, price, duration, active } = req.body;
  const updates = [];
  const params = [];

  if (name !== undefined) { updates.push('name = ?'); params.push(name); }
  if (description !== undefined) { updates.push('description = ?'); params.push(description); }
  if (price !== undefined) { updates.push('price = ?'); params.push(price); }
  if (duration !== undefined) { updates.push('duration = ?'); params.push(duration); }
  if (active !== undefined) { updates.push('active = ?'); params.push(active); }

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });

  params.push(req.params.id);
  await query(`UPDATE services SET ${updates.join(', ')} WHERE id = ?`, params);
  res.json(await get('SELECT * FROM services WHERE id = ?', [req.params.id]));
});

router.get('/hours', async (req, res) => {
  res.json(await query('SELECT * FROM business_hours ORDER BY day_of_week'));
});

router.put('/hours/:id', async (req, res) => {
  const { open_time, close_time, is_closed } = req.body;
  await query('UPDATE business_hours SET open_time = ?, close_time = ?, is_closed = ? WHERE id = ?',
    [open_time, close_time, is_closed ? 1 : 0, req.params.id]);
  res.json({ message: 'Updated' });
});

router.get('/time-off/:barber_id', async (req, res) => {
  res.json(await query('SELECT * FROM time_off WHERE barber_id = ? ORDER BY date', [req.params.barber_id]));
});

router.post('/time-off', async (req, res) => {
  const { barber_id, date, start_time, end_time, reason } = req.body;
  await query('INSERT INTO time_off (barber_id, date, start_time, end_time, reason) VALUES (?, ?, ?, ?, ?)',
    [barber_id, date, start_time, end_time, reason || null]);
  res.status(201).json({ message: 'Time off added' });
});

router.delete('/time-off/:id', async (req, res) => {
  await query('DELETE FROM time_off WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

export default router;
