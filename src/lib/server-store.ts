import { Booking } from '@/types'
import { createHash, randomUUID } from 'crypto'

interface Session {
  expires: number
  type: 'password' | 'google'
  email?: string
}

interface RateLimitEntry {
  attempts: number
  windowStart: number
  blockedUntil: number
}

const bookings = new Map<string, Booking>()
const sessions = new Map<string, Session>()
const oauthStates = new Map<string, number>()
const rateLimit = new Map<string, RateLimitEntry>()
const SESSION_TTL = 24 * 60 * 60 * 1000
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 15 * 60 * 1000
const RATE_LIMIT_BLOCK = 30 * 1000

const ADMIN_PW_HASH = process.env.ADMIN_PW_HASH
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const ADMIN_EMAIL = process.env.ADMIN_EMAIL

if (!ADMIN_PW_HASH && (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !ADMIN_EMAIL)) {
  console.error('❌ No authentication method configured.')
  console.error('   Set ADMIN_PW_HASH (password) OR GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET + ADMIN_EMAIL (Google OAuth).')
}

function cleanup(): void {
  const now = Date.now()
  for (const [token, s] of sessions) {
    if (now > s.expires) sessions.delete(token)
  }
  for (const [state, exp] of oauthStates) {
    if (now > exp) oauthStates.delete(state)
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

export function isPasswordConfigured(): boolean {
  return !!ADMIN_PW_HASH
}

export function isGoogleAuthConfigured(): boolean {
  return !!(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET && ADMIN_EMAIL)
}

export function getGoogleClientId(): string {
  return GOOGLE_CLIENT_ID || ''
}

export function getGoogleClientSecret(): string {
  return GOOGLE_CLIENT_SECRET || ''
}

export function getAdminEmail(): string {
  return ADMIN_EMAIL || ''
}

export function createOAuthState(): string {
  cleanup()
  const state = randomUUID()
  oauthStates.set(state, Date.now() + 10 * 60 * 1000)
  return state
}

export function consumeOAuthState(state: string): boolean {
  cleanup()
  const exp = oauthStates.get(state)
  if (!exp) return false
  oauthStates.delete(state)
  return Date.now() < exp
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

export function verifyPassword(password: string): boolean {
  if (!ADMIN_PW_HASH) return false
  return createHash('sha256').update(password).digest('hex') === ADMIN_PW_HASH
}

export function createSession(type: 'password' | 'google' = 'password', email?: string): string {
  cleanup()
  const token = randomUUID()
  sessions.set(token, { expires: Date.now() + SESSION_TTL, type, email })
  return token
}

export function verifySession(token: string): Session | null {
  cleanup()
  const s = sessions.get(token)
  if (!s) return null
  if (Date.now() > s.expires) { sessions.delete(token); return null }
  return s
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
