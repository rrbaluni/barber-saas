import { Booking } from '@/types'
import { randomUUID } from 'crypto'
import { Resend } from 'resend'
import { db, isDbConnected } from './db'

interface Session {
  expires: number
  email?: string
}

interface OtpEntry {
  code: string
  expires: number
  attempts: number
}

interface RateLimitEntry {
  attempts: number
  windowStart: number
  blockedUntil: number
}

const bookingsMem = new Map<string, Booking>()
const sessionsMem = new Map<string, Session>()
const otps = new Map<string, OtpEntry>()
const rateLimit = new Map<string, RateLimitEntry>()
const SESSION_TTL = 24 * 60 * 60 * 1000
const OTP_TTL = 5 * 60 * 1000
const OTP_MAX_ATTEMPTS = 3
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const RATE_LIMIT_BLOCK = 30 * 1000

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const RESEND_API_KEY = process.env.RESEND_API_KEY || ''

if (!ADMIN_EMAIL) {
  console.error('Missing ADMIN_EMAIL environment variable.')
}
if (!RESEND_API_KEY) {
  console.error('Missing RESEND_API_KEY environment variable.')
}

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function cleanup(): void {
  const now = Date.now()
  for (const [token, s] of sessionsMem) {
    if (now > s.expires) sessionsMem.delete(token)
  }
  for (const [email, otp] of otps) {
    if (now > otp.expires) otps.delete(email)
  }
  for (const [ip, entry] of rateLimit) {
    if (now > entry.windowStart + RATE_LIMIT_WINDOW && entry.blockedUntil === 0) {
      rateLimit.delete(ip)
    }
    if (entry.blockedUntil !== 0 && now > entry.blockedUntil) {
      rateLimit.delete(ip)
    }
  }
}

export function isOtpConfigured(): boolean {
  return !!(ADMIN_EMAIL && RESEND_API_KEY)
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL || ''
}

export async function sendOtp(email: string): Promise<{ success: boolean; error?: string }> {
  cleanup()
  if (email.toLowerCase() !== ADMIN_EMAIL?.toLowerCase()) {
    return { success: false, error: 'Unauthorized email address.' }
  }

  const code = generateOtpCode()
  otps.set(email.toLowerCase(), { code, expires: Date.now() + OTP_TTL, attempts: 0 })

  try {
    if (!resend) throw new Error('Resend not configured')
    await resend.emails.send({
      from: 'Barber Shop <onboarding@resend.dev>',
      to: email,
      subject: 'Your Admin Verification Code',
      html: `<p>Your admin verification code is:</p><h2 style="font-size: 28px; letter-spacing: 4px; color: #333;">${code}</h2><p>This code expires in 5 minutes.</p>`,
    })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to send email'
    return { success: false, error: message }
  }
}

export function verifyOtp(email: string, code: string): { valid: boolean; error?: string } {
  cleanup()
  const key = email.toLowerCase()
  const entry = otps.get(key)
  if (!entry) return { valid: false, error: 'No OTP sent. Request a new code.' }
  if (Date.now() > entry.expires) {
    otps.delete(key)
    return { valid: false, error: 'OTP expired. Request a new code.' }
  }
  if (entry.attempts >= OTP_MAX_ATTEMPTS) {
    otps.delete(key)
    return { valid: false, error: 'Too many incorrect attempts. Request a new code.' }
  }
  if (entry.code !== code) {
    entry.attempts++
    return { valid: false, error: 'Invalid code.' }
  }
  otps.delete(key)
  return { valid: true }
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; blockedUntil: number | null } {
  cleanup()
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry) return { allowed: true, remaining: RATE_LIMIT_MAX, blockedUntil: null }
  if (now < entry.blockedUntil) return { allowed: false, remaining: 0, blockedUntil: entry.blockedUntil }
  if (now > entry.windowStart + RATE_LIMIT_WINDOW) {
    rateLimit.delete(ip)
    return { allowed: true, remaining: RATE_LIMIT_MAX, blockedUntil: null }
  }
  if (entry.attempts >= RATE_LIMIT_MAX) {
    entry.blockedUntil = now + RATE_LIMIT_BLOCK
    return { allowed: false, remaining: 0, blockedUntil: entry.blockedUntil }
  }
  return { allowed: true, remaining: RATE_LIMIT_MAX - entry.attempts, blockedUntil: null }
}

export function recordFailedAttempt(ip: string): void {
  cleanup()
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry) { rateLimit.set(ip, { attempts: 1, windowStart: now, blockedUntil: 0 }); return }
  if (now < entry.blockedUntil) return
  if (now > entry.windowStart + RATE_LIMIT_WINDOW) { rateLimit.set(ip, { attempts: 1, windowStart: now, blockedUntil: 0 }); return }
  entry.attempts++
  if (entry.attempts >= RATE_LIMIT_MAX) entry.blockedUntil = now + RATE_LIMIT_BLOCK
}

export function clearRateLimit(ip: string): void {
  rateLimit.delete(ip)
}

export async function createSession(email?: string): Promise<string> {
  cleanup()
  const token = randomUUID()
  const expires = Date.now() + SESSION_TTL
  if (db) {
    await db.from('sessions').insert({ token, email: email || '', expires })
  }
  sessionsMem.set(token, { expires, email })
  return token
}

export async function verifySession(token: string): Promise<Session | null> {
  cleanup()
  if (db) {
    const { data } = await db.from('sessions').select('*').eq('token', token).maybeSingle()
    if (!data) return null
    if (Date.now() > data.expires) {
      await db.from('sessions').delete().eq('token', token)
      return null
    }
    return { expires: data.expires, email: data.email || undefined }
  }
  const s = sessionsMem.get(token)
  if (!s) return null
  if (Date.now() > s.expires) { sessionsMem.delete(token); return null }
  return s
}

export async function getAllBookings(): Promise<Booking[]> {
  if (db) {
    const { data } = await db.from('bookings').select('*').order('created_at', { ascending: false })
    if (!data) return []
    return data as Booking[]
  }
  return Array.from(bookingsMem.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  if (db) {
    const { data } = await db.from('bookings').select('*').eq('id', id).maybeSingle()
    return (data as Booking) || undefined
  }
  return bookingsMem.get(id)
}

export async function addBooking(booking: Booking): Promise<Booking> {
  if (db) {
    const { data, error } = await db.from('bookings').insert({
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone,
      service_id: booking.serviceId,
      barber_id: booking.barberId,
      date: booking.date,
      time: booking.time,
      status: booking.status,
      notes: booking.notes || '',
    }).select('*').single()
    if (error) throw new Error(error.message)
    return mapRowToBooking(data)
  }
  bookingsMem.set(booking.id, booking)
  return booking
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | undefined> {
  if (db) {
    const patch: Record<string, unknown> = {}
    if (updates.customerName !== undefined) patch.customer_name = updates.customerName
    if (updates.customerEmail !== undefined) patch.customer_email = updates.customerEmail
    if (updates.customerPhone !== undefined) patch.customer_phone = updates.customerPhone
    if (updates.serviceId !== undefined) patch.service_id = updates.serviceId
    if (updates.barberId !== undefined) patch.barber_id = updates.barberId
    if (updates.date !== undefined) patch.date = updates.date
    if (updates.time !== undefined) patch.time = updates.time
    if (updates.status !== undefined) patch.status = updates.status
    if (updates.notes !== undefined) patch.notes = updates.notes
    const { data } = await db.from('bookings').update(patch).eq('id', id).select('*').maybeSingle()
    return (data as Booking) || undefined
  }
  const existing = bookingsMem.get(id)
  if (!existing) return undefined
  const updated = { ...existing, ...updates }
  bookingsMem.set(id, updated)
  return updated
}

export async function deleteBooking(id: string): Promise<boolean> {
  if (db) {
    const { error } = await db.from('bookings').delete().eq('id', id)
    return !error
  }
  return bookingsMem.delete(id)
}

export async function getBookingsForDate(date: string): Promise<{ count: number; times: string[] }> {
  if (db) {
    const { data } = await db.from('bookings')
      .select('time')
      .eq('date', date)
      .in('status', ['confirmed', 'completed'])
    return { count: data?.length || 0, times: data?.map(r => r.time) || [] }
  }
  const matching = Array.from(bookingsMem.values()).filter(
    b => b.date === date && (b.status === 'confirmed' || b.status === 'completed')
  )
  return { count: matching.length, times: matching.map(b => b.time) }
}

function mapRowToBooking(row: Record<string, unknown>): Booking {
  return {
    id: String(row.id),
    customerName: String(row.customer_name),
    customerEmail: String(row.customer_email),
    customerPhone: String(row.customer_phone),
    serviceId: String(row.service_id),
    barberId: String(row.barber_id),
    date: String(row.date),
    time: String(row.time),
    status: row.status as Booking['status'],
    notes: String(row.notes) || undefined,
    createdAt: String(row.created_at),
  }
}
