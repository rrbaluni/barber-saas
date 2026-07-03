'use client'

import { Booking, ShopSettings, DaySchedule } from '@/types'

const BOOKINGS_KEY = 'barberia_bookings'
const SETTINGS_KEY = 'barberia_settings'

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(BOOKINGS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings()
  bookings.push(booking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))
}

export function updateBooking(id: string, updates: Partial<Booking>): void {
  const bookings = getBookings()
  const updated = bookings.map((b) => (b.id === id ? { ...b, ...updates } : b))
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated))
}

export function updateBookingStatus(
  id: string,
  status: Booking['status']
): void {
  updateBooking(id, { status })
}

export function deleteBooking(id: string): void {
  const bookings = getBookings()
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings.filter((b) => b.id !== id)))
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
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
