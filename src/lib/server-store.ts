import { Booking } from '@/types'
import { createHash, randomUUID } from 'crypto'

interface Session {
  expires: number
}

interface RateLimitEntry {
  attempts: number
  windowStart: number
  blockedUntil: number
}

const bookings = new Map<string, Booking>()
const sessions = new Map<string, Session>()
const rateLimit = new Map<string, RateLimitEntry>()
const SESSION_TTL = 24 * 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const RATE_LIMIT_BLOCK = 30 * 1000

const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH
if (!ADMIN_PW_HASH) {
  console.warn('⚠  ADMIN_PW_HASH env var not set — using default password (admin123). Set ADMIN_PW_HASH in production.')
}

function cleanup(): void {
  const now = Date.now()
  for (const [token, s] of sessions) {
    if (now > s.expires) sessions.delete(token)
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

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; blockedUntil: number | null } {
  cleanup()
  const now = Date.now()
  const entry = rateLimit.get(ip)

  if (!entry) {
    return { allowed: true, remaining: RATE_LIMIT_MAX, blockedUntil: null }
  }

  if (now < entry.blockedUntil) {
    return { allowed: false, remaining: 0, blockedUntil: entry.blockedUntil }
  }

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

  if (!entry) {
    rateLimit.set(ip, { attempts: 1, windowStart: now, blockedUntil: 0 })
    return
  }

  if (now < entry.blockedUntil) return

  if (now > entry.windowStart + RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { attempts: 1, windowStart: now, blockedUntil: 0 })
    return
  }

  entry.attempts++

  if (entry.attempts >= RATE_LIMIT_MAX) {
    entry.blockedUntil = now + RATE_LIMIT_BLOCK
  }
}

export function clearRateLimit(ip: string): void {
  rateLimit.delete(ip)
}

export function verifyPassword(password: string): boolean {
  const hash = ADMIN_PW_HASH || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
  return createHash('sha256').update(password).digest('hex') === hash
}

export function createSession(): string {
  cleanup()
  const token = randomUUID()
  sessions.set(token, { expires: Date.now() + SESSION_TTL })
  return token
}

export function verifySession(token: string): boolean {
  cleanup()
  const s = sessions.get(token)
  if (!s) return false
  if (Date.now() > s.expires) {
    sessions.delete(token)
    return false
  }
  return true
}

export function getAllBookings(): Booking[] {
  return Array.from(bookings.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getBooking(id: string): Booking | undefined {
  return bookings.get(id)
}

export function addBooking(booking: Booking): void {
  bookings.set(booking.id, booking)
}

export function updateBooking(id: string, updates: Partial<Booking>): Booking | undefined {
  const existing = bookings.get(id)
  if (!existing) return undefined
  const updated = { ...existing, ...updates }
  bookings.set(id, updated)
  return updated
}

export function deleteBooking(id: string): boolean {
  return bookings.delete(id)
}
