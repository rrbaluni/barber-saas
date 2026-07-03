import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings, addBooking, verifySession } from '@/lib/server-store'

function isAuthenticated(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return false
  return verifySession(auth.slice(7))
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(getAllBookings())
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, serviceId, barberId, customerName, customerEmail, customerPhone, date, time, notes, status, createdAt } = body
    if (!id || !serviceId || !barberId || !customerName || !customerEmail || !customerPhone || !date || !time || !createdAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const booking = {
      id, serviceId, barberId,
      customerName: customerName.replace(/<[^>]*>/g, '').trim(),
      customerEmail: customerEmail.replace(/<[^>]*>/g, '').trim(),
      customerPhone: customerPhone.replace(/<[^>]*>/g, '').trim(),
      date, time,
      notes: notes ? notes.replace(/<[^>]*>/g, '').trim() : undefined,
      status: status || 'confirmed',
      createdAt,
    }
    addBooking(booking)
    return NextResponse.json(booking, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
