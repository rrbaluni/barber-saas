import { Booking } from '@/types'
import { createHash, randomUUID } from 'crypto'

interface Session {
  expires: number
}

const bookings = new Map<string, Booking>()
const sessions = new Map<string, Session>()
const SESSION_TTL = 24 * 60 * 60 * 1000
const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH || '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'

function cleanup(): void {
  const now = Date.now()
  for (const [token, s] of sessions) {
    if (now > s.expires) sessions.delete(token)
  }
}

export function verifyPassword(password: string): boolean {
  return createHash('sha256').update(password).digest('hex') === ADMIN_PW_HASH
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
