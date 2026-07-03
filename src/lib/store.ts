'use client'

import { Booking, ShopSettings } from '@/types'

const BOOKINGS_KEY = 'barberia_bookings'
const BOOKINGS_HASH_KEY = 'barberia_bookings_hash'
const SETTINGS_KEY = 'barberia_settings'

function hash(data: string): string {
  let h = 0
  for (let i = 0; i < data.length; i++) {
    h = ((h << 5) - h + data.charCodeAt(i)) | 0
  }
  return (h >>> 0).toString(36)
}

function storeWithIntegrity(key: string, hashKey: string, data: unknown): void {
  const raw = JSON.stringify(data)
  localStorage.setItem(key, raw)
  localStorage.setItem(hashKey, hash(raw))
}

function readWithIntegrity<T>(key: string, hashKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    const storedHash = localStorage.getItem(hashKey)
    if (!raw || !storedHash) return fallback
    if (hash(raw) !== storedHash) {
      localStorage.removeItem(key)
      localStorage.removeItem(hashKey)
      return fallback
    }
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim()
}

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  return readWithIntegrity<Booking[]>(BOOKINGS_KEY, BOOKINGS_HASH_KEY, [])
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings()
  bookings.push(booking)
  storeWithIntegrity(BOOKINGS_KEY, BOOKINGS_HASH_KEY, bookings)
}

export function updateBooking(id: string, updates: Partial<Booking>): void {
  const bookings = getBookings()
  const updated = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b))
  storeWithIntegrity(BOOKINGS_KEY, BOOKINGS_HASH_KEY, updated)
}

export function updateBookingStatus(id: string, status: Booking['status']): void {
  updateBooking(id, { status })
}

export function deleteBooking(id: string): void {
  const bookings = getBookings()
  storeWithIntegrity(BOOKINGS_KEY, BOOKINGS_HASH_KEY, bookings.filter((b) => b.id !== id))
}

export function getBookingsByDate(date: string): Booking[] {
  return getBookings().filter((b) => b.date === date)
}

export function getBookedSlots(date: string): string[] {
  return getBookingsByDate(date)
    .filter((b) => b.status === 'confirmed')
    .map((b) => b.time)
}

export function getDailyBookingCount(date: string): number {
  return getBookingsByDate(date).filter((b) => b.status === 'confirmed').length
}

export function getDefaultSettings(): ShopSettings {
  return {
    schedules: [
      { day: 'Monday', open: '09:00', close: '19:00', maxBookings: 20, enabled: true },
      { day: 'Tuesday', open: '09:00', close: '19:00', maxBookings: 20, enabled: true },
      { day: 'Wednesday', open: '09:00', close: '19:00', maxBookings: 20, enabled: true },
      { day: 'Thursday', open: '09:00', close: '19:00', maxBookings: 20, enabled: true },
      { day: 'Friday', open: '09:00', close: '19:00', maxBookings: 20, enabled: true },
      { day: 'Saturday', open: '09:00', close: '18:00', maxBookings: 16, enabled: true },
      { day: 'Sunday', open: '10:00', close: '16:00', maxBookings: 10, enabled: true },
    ],
    slotInterval: 30,
  }
}

export function getSettings(): ShopSettings {
  if (typeof window === 'undefined') return getDefaultSettings()
  try {
    const data = localStorage.getItem(SETTINGS_KEY)
    return data ? JSON.parse(data) : getDefaultSettings()
  } catch {
    return getDefaultSettings()
  }
}

export function saveSettings(settings: ShopSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export function sanitizeInput(input: string): string {
  return sanitize(input)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
