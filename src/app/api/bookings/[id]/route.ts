import { NextRequest, NextResponse } from 'next/server'
import { getBooking, updateBooking, deleteBooking, verifySession } from '@/lib/server-store'
import { isValidOrigin } from '@/lib/api-utils'

function isAuthenticated(request: NextRequest): boolean {
  const auth = request.headers.get('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) return false
  return verifySession(auth.slice(7))
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  const existing = getBooking(id)
  if (!existing) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  try {
    const body = await request.json()
    const clean: Record<string, unknown> = {}
    if (typeof body.status === 'string') clean.status = body.status
    if (typeof body.date === 'string') clean.date = body.date
    if (typeof body.time === 'string') clean.time = body.time
    const updated = updateBooking(id, clean)
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const { id } = await params
  if (!getBooking(id)) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }
  deleteBooking(id)
  return NextResponse.json({ success: true })
}
