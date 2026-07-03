import { NextRequest, NextResponse } from 'next/server'
import { verifyOtp, createSession } from '@/lib/server-store'

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }
    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Verification code required' }, { status: 400 })
    }

    const result = verifyOtp(email, code)
    if (!result.valid) {
      return NextResponse.json({ error: result.error || 'Invalid code.' }, { status: 401 })
    }

    const token = await createSession(email)
    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
