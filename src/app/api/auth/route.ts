import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createSession, checkRateLimit, recordFailedAttempt, clearRateLimit } from '@/lib/server-store'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const ip = getClientIp(request)
    const { allowed, remaining, blockedUntil } = checkRateLimit(ip)

    if (!allowed) {
      const retryAfter = blockedUntil ? Math.ceil((blockedUntil - Date.now()) / 1000) : 30
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${retryAfter} seconds.` },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      )
    }

    if (verifyPassword(password)) {
      clearRateLimit(ip)
      const token = createSession()
      return NextResponse.json({ token })
    }

    recordFailedAttempt(ip)
    return NextResponse.json(
      { error: 'Invalid password', remaining: Math.max(0, remaining - 1) },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
