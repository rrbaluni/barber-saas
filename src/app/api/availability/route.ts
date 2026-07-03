import { NextRequest, NextResponse } from 'next/server'
import { getAllBookings } from '@/lib/server-store'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
  }
  const all = getAllBookings()
  const dayBookings = all.filter((b) => b.date === date && b.status === 'confirmed')
  return NextResponse.json({
    bookedSlots: dayBookings.map((b) => b.time),
    dailyCount: dayBookings.length,
  })
}
