import { NextRequest } from 'next/server'

const PHONE_REGEX = /^[+\d][\d\s\-().]{6,20}$/
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  if (!origin && !referer) return false

  const allowed = [
    `http://${host}`,
    `https://${host}`,
    process.env.APP_ORIGIN,
  ].filter(Boolean) as string[]

  if (origin) {
    const ok = allowed.some((a) => origin.startsWith(a) || origin === 'null')
    if (!ok) return false
  }

  if (referer) {
    const ok = allowed.some((a) => referer.startsWith(a))
    if (!ok) return false
  }

  return true
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '')
}

export interface ValidationError {
  field: string
  message: string
}

export function validateBookingInput(body: Record<string, unknown>): ValidationError[] {
  const errors: ValidationError[] = []

  if (!body.id || typeof body.id !== 'string') errors.push({ field: 'id', message: 'Required' })
  if (!body.serviceId || typeof body.serviceId !== 'string') errors.push({ field: 'serviceId', message: 'Required' })
  if (!body.barberId || typeof body.barberId !== 'string') errors.push({ field: 'barberId', message: 'Required' })
  if (!body.date || typeof body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) errors.push({ field: 'date', message: 'Invalid date format' })
  if (!body.time || typeof body.time !== 'string' || !/^\d{2}:\d{2}$/.test(body.time)) errors.push({ field: 'time', message: 'Invalid time format' })
  if (!body.createdAt || typeof body.createdAt !== 'string') errors.push({ field: 'createdAt', message: 'Required' })

  if (typeof body.customerName === 'string') {
    const clean = stripHtml(body.customerName).trim()
    if (clean.length < 2) errors.push({ field: 'customerName', message: 'Must be at least 2 characters' })
    if (clean.length > 100) errors.push({ field: 'customerName', message: 'Must be under 100 characters' })
  } else {
    errors.push({ field: 'customerName', message: 'Required' })
  }

  if (typeof body.customerEmail === 'string') {
    const clean = stripHtml(body.customerEmail).trim()
    if (!EMAIL_REGEX.test(clean)) errors.push({ field: 'customerEmail', message: 'Invalid email' })
    if (clean.length > 255) errors.push({ field: 'customerEmail', message: 'Too long' })
  } else {
    errors.push({ field: 'customerEmail', message: 'Required' })
  }

  if (typeof body.customerPhone === 'string') {
    const clean = stripHtml(body.customerPhone).trim()
    if (!PHONE_REGEX.test(clean)) errors.push({ field: 'customerPhone', message: 'Invalid phone number' })
    if (clean.length > 20) errors.push({ field: 'customerPhone', message: 'Too long' })
  } else {
    errors.push({ field: 'customerPhone', message: 'Required' })
  }

  if (body.notes !== undefined && body.notes !== null) {
    if (typeof body.notes !== 'string') errors.push({ field: 'notes', message: 'Must be text' })
    else if (stripHtml(body.notes).trim().length > 500) errors.push({ field: 'notes', message: 'Must be under 500 characters' })
  }

  return errors
}

export function sanitize(str: string): string {
  return stripHtml(str).trim()
}
