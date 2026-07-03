import { NextRequest, NextResponse } from 'next/server'
import { getBookingsForDate } from '@/lib/server-store'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'Date parameter required' }, { status: 400 })
  }
  const { count, times } = await getBookingsForDate(date)
  return NextResponse.json({ bookedSlots: times, dailyCount: count })
}
