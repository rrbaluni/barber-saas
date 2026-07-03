import { NextRequest, NextResponse } from 'next/server'
import { sendOtp, isOtpConfigured, checkRateLimit, recordFailedAttempt, clearRateLimit, getAdminEmail } from '@/lib/server-store'

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    if (!isOtpConfigured()) {
      return NextResponse.json(
        { error: 'Email OTP not configured. Set ADMIN_EMAIL, SMTP_HOST, SMTP_USER, SMTP_PASS.' },
        { status: 503 }
      )
    }

    const { email } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const ip = getClientIp(request)
    const { allowed } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
    }

    const result = await sendOtp(email)
    if (!result.success) {
      recordFailedAttempt(ip)
      return NextResponse.json({ error: result.error || 'Failed to send OTP.' }, { status: 401 })
    }

    clearRateLimit(ip)
    const masked = getAdminEmail().replace(/^(.)(.*)(@.*)$/, (_, a, b, c) => `${a}${'*'.repeat(Math.min(b.length, 4))}${c}`)
    return NextResponse.json({ message: `OTP sent to ${masked}` })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
