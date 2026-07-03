import { Router } from 'express';
import { query, get } from '../db/index.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    res.json(await query('SELECT * FROM barbers WHERE active = 1'));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const barber = await get('SELECT * FROM barbers WHERE id = ?', [req.params.id]);
    if (!barber) return res.status(404).json({ error: 'Barber not found' });
    const services = await query(`SELECT s.* FROM services s JOIN barber_services bs ON bs.service_id = s.id WHERE bs.barber_id = ? AND s.active = 1`, [req.params.id]);
    res.json({ ...barber, services });
  } catch (err) { next(err); }
});

router.get('/:id/availability', async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date || typeof date !== 'string') return res.status(400).json({ error: 'Date is required' });
    const barberId = req.params.id;
    const dayOfWeek = new Date(date + 'T12:00:00').getDay();
    const hours = await get('SELECT * FROM business_hours WHERE day_of_week = ?', [dayOfWeek]);
    if (!hours || hours.is_closed) return res.json([]);
    const [timeOff, rawBookings] = await Promise.all([
      query('SELECT start_time, end_time FROM time_off WHERE barber_id = ? AND date = ?', [barberId, date]),
      query(`SELECT b.time, s.duration FROM bookings b JOIN services s ON s.id = b.service_id WHERE b.barber_id = ? AND b.date = ? AND b.status != 'cancelled'`, [barberId, date]),
    ]);
    const bookedSlots = new Set<string>();
    for (const b of rawBookings) {
      const startMin = timeToMinutes(b.time as string);
      for (let m = 0; m < (b.duration as number); m += 30) bookedSlots.add(minutesToTime(startMin + m));
    }
    const offSlots = new Set<string>();
    for (const t of timeOff) {
      const start = timeToMinutes((t.start_time as string) || '00:00');
      const end = timeToMinutes((t.end_time as string) || '23:59');
      for (let m = start; m < end; m += 30) offSlots.add(minutesToTime(m));
    }
    const open = timeToMinutes(hours.open_time as string);
    const close = timeToMinutes(hours.close_time as string);
    const slots: string[] = [];
    for (let m = open; m < close; m += 30) { const t = minutesToTime(m); if (!bookedSlots.has(t) && !offSlots.has(t)) slots.push(t); }
    res.json(slots);
  } catch (err) { next(err); }
});

function timeToMinutes(t: string): number {
  const parts = t.split(':');
  return Number(parts[0]) * 60 + Number(parts[1]);
}
function minutesToTime(m: number): string { return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; }

export default router;
