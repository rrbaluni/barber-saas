import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSession } from '@/lib/server-store'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }
    if (verifyPassword(password)) {
      const token = createSession()
      return NextResponse.json({ token })
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
