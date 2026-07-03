import { Router } from 'express';
import { query, get } from '../db/index.js';
import { validate } from '../middleware/validate.js';
import { statusUpdateSchema, createBarberSchema, updateBarberSchema, createServiceSchema, updateServiceSchema, hoursUpdateSchema, timeOffSchema } from '../schemas.js';

const router = Router();

router.get('/bookings', async (req, res, next) => {
  try {
    const { date } = req.query;
    let sql = `SELECT b.*, br.name as barber_name, s.name as service_name, s.price FROM bookings b JOIN barbers br ON br.id = b.barber_id JOIN services s ON s.id = b.service_id`;
    const params: string[] = [];
    if (date && typeof date === 'string') { sql += ' WHERE b.date = ?'; params.push(date); }
    res.json(await query(sql + ' ORDER BY b.date DESC, b.time DESC', params));
  } catch (err) { next(err); }
});

router.patch('/bookings/:id/status', validate(statusUpdateSchema), async (req, res, next) => {
  try { await query('UPDATE bookings SET status = ? WHERE id = ?', [req.body.status, req.params.id]); res.json({ message: 'Status updated' }); }
  catch (err) { next(err); }
});

router.post('/barbers', validate(createBarberSchema), async (req, res, next) => {
  try {
    await query('INSERT INTO barbers (name, bio) VALUES (?, ?)', [req.body.name, req.body.bio || null]);
    res.status(201).json(await get('SELECT * FROM barbers ORDER BY id DESC LIMIT 1'));
  } catch (err) { next(err); }
});

router.patch('/barbers/:id', validate(updateBarberSchema), async (req, res, next) => {
  try {
    const { name, bio, active } = req.body;
    const updates: string[] = []; const params: unknown[] = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (bio !== undefined) { updates.push('bio = ?'); params.push(bio); }
    if (active !== undefined) { updates.push('active = ?'); params.push(active); }
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await query(`UPDATE barbers SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json(await get('SELECT * FROM barbers WHERE id = ?', [req.params.id]));
  } catch (err) { next(err); }
});

router.post('/services', validate(createServiceSchema), async (req, res, next) => {
  try {
    await query('INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)', [req.body.name, req.body.description || null, req.body.price, req.body.duration]);
    res.status(201).json(await get('SELECT * FROM services ORDER BY id DESC LIMIT 1'));
  } catch (err) { next(err); }
});

router.patch('/services/:id', validate(updateServiceSchema), async (req, res, next) => {
  try {
    const { name, description, price, duration, active } = req.body;
    const updates: string[] = []; const params: unknown[] = [];
    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (price !== undefined) { updates.push('price = ?'); params.push(price); }
    if (duration !== undefined) { updates.push('duration = ?'); params.push(duration); }
    if (active !== undefined) { updates.push('active = ?'); params.push(active); }
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
    params.push(req.params.id);
    await query(`UPDATE services SET ${updates.join(', ')} WHERE id = ?`, params);
    res.json(await get('SELECT * FROM services WHERE id = ?', [req.params.id]));
  } catch (err) { next(err); }
});

router.get('/hours', async (_req, res, next) => {
  try { res.json(await query('SELECT * FROM business_hours ORDER BY day_of_week')); }
  catch (err) { next(err); }
});

router.put('/hours/:id', validate(hoursUpdateSchema), async (req, res, next) => {
  try {
    await query('UPDATE business_hours SET open_time = ?, close_time = ?, is_closed = ? WHERE id = ?', [req.body.open_time, req.body.close_time, req.body.is_closed ? 1 : 0, req.params.id]);
    res.json({ message: 'Updated' });
  } catch (err) { next(err); }
});

router.get('/time-off/:barber_id', async (req, res, next) => {
  try { res.json(await query('SELECT * FROM time_off WHERE barber_id = ? ORDER BY date', [req.params.barber_id])); }
  catch (err) { next(err); }
});

router.post('/time-off', validate(timeOffSchema), async (req, res, next) => {
  try {
    const { barber_id, date, start_time, end_time, reason } = req.body;
    await query('INSERT INTO time_off (barber_id, date, start_time, end_time, reason) VALUES (?, ?, ?, ?, ?)', [barber_id, date, start_time || null, end_time || null, reason || null]);
    res.status(201).json({ message: 'Time off added' });
  } catch (err) { next(err); }
});

router.delete('/time-off/:id', async (req, res, next) => {
  try { await query('DELETE FROM time_off WHERE id = ?', [req.params.id]); res.json({ message: 'Deleted' }); }
  catch (err) { next(err); }
});

export default router;
