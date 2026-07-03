'use client'

import { Booking } from '@/types'

const BOOKINGS_KEY = 'barberia_bookings'

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

export function updateBookingStatus(
  id: string,
  status: Booking['status']
): void {
  const bookings = getBookings()
  const updated = bookings.map((b) => (b.id === id ? { ...b, status } : b))
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(updated))
}

export function getBookingsByDate(date: string): Booking[] {
  return getBookings().filter((b) => b.date === date)
}

export function getBookedSlots(date: string): string[] {
  return getBookingsByDate(date)
    .filter((b) => b.status === 'confirmed')
    .map((b) => b.time)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}
