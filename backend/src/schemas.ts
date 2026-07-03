import { z } from 'zod';

export const createBookingSchema = z.object({
  barber_id: z.coerce.number().int().positive(),
  service_id: z.coerce.number().int().positive(),
  customer_name: z.string().min(1, 'Name is required').max(100),
  customer_email: z.string().email('Invalid email'),
  customer_phone: z.string().max(20).optional().default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
  notes: z.string().max(500).optional().default(''),
});

export const emailQuerySchema = z.object({
  email: z.string().email('Invalid email'),
});

export const statusUpdateSchema = z.object({
  status: z.enum(['confirmed', 'completed', 'cancelled', 'no-show']),
});

export const createBarberSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  bio: z.string().max(500).optional().default(''),
});

export const updateBarberSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  active: z.coerce.number().min(0).max(1).optional(),
});

export const createServiceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional().default(''),
  price: z.coerce.number().positive('Price must be positive'),
  duration: z.coerce.number().int().positive('Duration must be positive'),
});

export const updateServiceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  price: z.coerce.number().positive().optional(),
  duration: z.coerce.number().int().positive().optional(),
  active: z.coerce.number().min(0).max(1).optional(),
});

export const hoursUpdateSchema = z.object({
  open_time: z.string().regex(/^\d{2}:\d{2}$/),
  close_time: z.string().regex(/^\d{2}:\d{2}$/),
  is_closed: z.coerce.number().min(0).max(1),
});

export const timeOffSchema = z.object({
  barber_id: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  start_time: z.string().regex(/^\d{2}:\d{2}$/).optional().default(''),
  end_time: z.string().regex(/^\d{2}:\d{2}$/).optional().default(''),
  reason: z.string().max(500).optional().default(''),
});
