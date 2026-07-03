import { Router } from 'express';
import { query, get } from '../db/index.js';
import { validate } from '../middleware/validate.js';
import { createBookingSchema, emailQuerySchema } from '../schemas.js';

const router = Router();

router.post('/', validate(createBookingSchema), async (req, res, next) => {
  try {
    const { barber_id, service_id, customer_name, customer_email, customer_phone, date, time, notes } = req.body;
    const [barber, service] = await Promise.all([
      get('SELECT id FROM barbers WHERE id = ? AND active = 1', [barber_id]),
      get('SELECT * FROM services WHERE id = ? AND active = 1', [service_id]),
    ]);
    if (!barber) return res.status(404).json({ error: 'Barber not found' });
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const existing = await query(`SELECT b.time, s.duration FROM bookings b JOIN services s ON s.id = b.service_id WHERE b.barber_id = ? AND b.date = ? AND b.status != 'cancelled'`, [barber_id, date]);
    const reqStart = timeToMinutes(time);
    const reqEnd = reqStart + (service.duration as number);
    for (const b of existing) {
      const bStart = timeToMinutes(b.time as string);
      if (reqStart < bStart + (b.duration as number) && reqEnd > bStart)
        return res.status(409).json({ error: 'Time slot is no longer available' });
    }

    await query(`INSERT INTO bookings (barber_id, service_id, customer_name, customer_email, customer_phone, date, time, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [barber_id, service_id, customer_name, customer_email, customer_phone || null, date, time, notes || null]);
    const booking = await get('SELECT * FROM bookings ORDER BY id DESC LIMIT 1');
    res.status(201).json(booking);
  } catch (err) { next(err); }
});

router.get('/', validate(emailQuerySchema, 'query'), async (req, res, next) => {
  try {
    res.json(await query(`SELECT b.*, br.name as barber_name, s.name as service_name, s.price FROM bookings b JOIN barbers br ON br.id = b.barber_id JOIN services s ON s.id = b.service_id WHERE b.customer_email = ? ORDER BY b.date DESC, b.time DESC`, [req.query.email]));
  } catch (err) { next(err); }
});

router.patch('/:id/cancel', async (req, res, next) => {
  try {
    const result = await query("UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status = 'confirmed'", [req.params.id]);
    if (result.length === 0) return res.status(404).json({ error: 'Booking not found or already cancelled' });
    res.json({ message: 'Booking cancelled' });
  } catch (err) { next(err); }
});

function timeToMinutes(t: string): number {
  const parts = t.split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}

export default router;
