import { Router } from 'express';
import { query, get } from '../db/index.js';

const router = Router();

router.get('/', async (req, res) => {
  const barbers = await query('SELECT * FROM barbers WHERE active = 1');
  res.json(barbers);
});

router.get('/:id', async (req, res) => {
  const barber = await get('SELECT * FROM barbers WHERE id = ?', [req.params.id]);
  if (!barber) return res.status(404).json({ error: 'Barber not found' });

  const services = await query(`
    SELECT s.* FROM services s
    JOIN barber_services bs ON bs.service_id = s.id
    WHERE bs.barber_id = ? AND s.active = 1
  `, [req.params.id]);

  res.json({ ...barber, services });
});

router.get('/:id/availability', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const barberId = req.params.id;
  const dayOfWeek = new Date(date + 'T12:00:00').getDay();

  const hours = await get('SELECT * FROM business_hours WHERE day_of_week = ?', [dayOfWeek]);
  if (!hours || hours.is_closed) return res.json([]);

  const timeOff = await query('SELECT start_time, end_time FROM time_off WHERE barber_id = ? AND date = ?', [barberId, date]);
  const rawBookings = await query(`
    SELECT b.time, s.duration FROM bookings b
    JOIN services s ON s.id = b.service_id
    WHERE b.barber_id = ? AND b.date = ? AND b.status != 'cancelled'
  `, [barberId, date]);

  const bookedSlots = new Set();
  for (const b of rawBookings) {
    const startMin = timeToMinutes(b.time);
    for (let m = 0; m < b.duration; m += 30) {
      bookedSlots.add(minutesToTime(startMin + m));
    }
  }

  const offSlots = new Set();
  for (const t of timeOff) {
    const start = timeToMinutes(t.start_time || '00:00');
    const end = timeToMinutes(t.end_time || '23:59');
    for (let m = start; m < end; m += 30) {
      offSlots.add(minutesToTime(m));
    }
  }

  const open = timeToMinutes(hours.open_time);
  const close = timeToMinutes(hours.close_time);
  const slots = [];

  for (let m = open; m < close; m += 30) {
    const time = minutesToTime(m);
    if (!bookedSlots.has(time) && !offSlots.has(time)) {
      slots.push(time);
    }
  }

  res.json(slots);
});

function timeToMinutes(t) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(m) {
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

export default router;
