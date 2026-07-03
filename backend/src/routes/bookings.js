import { Router } from 'express';
import { query, get } from '../db/index.js';

const router = Router();

router.post('/', async (req, res) => {
  const { barber_id, service_id, customer_name, customer_email, customer_phone, date, time, notes } = req.body;

  if (!barber_id || !service_id || !customer_name || !customer_email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const barber = await get('SELECT id FROM barbers WHERE id = ? AND active = 1', [barber_id]);
  if (!barber) return res.status(404).json({ error: 'Barber not found' });

  const service = await get('SELECT * FROM services WHERE id = ? AND active = 1', [service_id]);
  if (!service) return res.status(404).json({ error: 'Service not found' });

  const existing = await query(`
    SELECT b.time, s.duration FROM bookings b
    JOIN services s ON s.id = b.service_id
    WHERE b.barber_id = ? AND b.date = ? AND b.status != 'cancelled'
  `, [barber_id, date]);

  const reqStart = timeToMinutes(time);
  const reqEnd = reqStart + service.duration;

  for (const b of existing) {
    const bStart = timeToMinutes(b.time);
    const bEnd = bStart + b.duration;
    if (reqStart < bEnd && reqEnd > bStart) {
      return res.status(409).json({ error: 'Time slot is no longer available' });
    }
  }

  await query(`
    INSERT INTO bookings (barber_id, service_id, customer_name, customer_email, customer_phone, date, time, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [barber_id, service_id, customer_name, customer_email, customer_phone || null, date, time, notes || null]);

  const booking = await get('SELECT * FROM bookings ORDER BY id DESC LIMIT 1');
  res.status(201).json(booking);
});

router.get('/', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const bookings = await query(`
    SELECT b.*, br.name as barber_name, s.name as service_name, s.price
    FROM bookings b
    JOIN barbers br ON br.id = b.barber_id
    JOIN services s ON s.id = b.service_id
    WHERE b.customer_email = ?
    ORDER BY b.date DESC, b.time DESC
  `, [email]);

  res.json(bookings);
});

router.patch('/:id/cancel', async (req, res) => {
  const result = await query(
    "UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status = 'confirmed'",
    [req.params.id]
  );

  if (result.changes === 0) return res.status(404).json({ error: 'Booking not found or already cancelled' });
  res.json({ message: 'Booking cancelled' });
});

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

export default router;
