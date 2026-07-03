import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings, addBooking, verifySession } from '@/lib/server-store'
import { isValidOrigin, validateBookingInput, sanitize } from '@/lib/api-utils'

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return false
  return !!(await verifySession(auth.slice(7)))
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await getAllBookings())
}

export async function POST(request: NextRequest) {
  try {
    if (!isValidOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const errors = validateBookingInput(body)
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 422 })
    }

    const booking = {
      id: body.id as string,
      serviceId: body.serviceId as string,
      barberId: body.barberId as string,
      customerName: sanitize(body.customerName as string),
      customerEmail: sanitize(body.customerEmail as string),
      customerPhone: sanitize(body.customerPhone as string),
      date: body.date as string,
      time: body.time as string,
      notes: body.notes ? sanitize(body.notes as string) : undefined,
      status: 'confirmed' as const,
      createdAt: body.createdAt as string,
    }

    const created = await addBooking(booking)
    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
