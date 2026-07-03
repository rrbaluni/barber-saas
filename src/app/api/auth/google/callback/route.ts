import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { consumeOAuthState, getGoogleClientId, getGoogleClientSecret, getAdminEmail, createSession } from '@/lib/server-store'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?google_error=${error}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?google_error=missing_params`
    )
  }

  const validState = consumeOAuthState(state)
  if (!validState) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?google_error=invalid_state`
    )
  }

  try {
    const client = new OAuth2Client(
      getGoogleClientId(),
      getGoogleClientSecret(),
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`
    )

    const { tokens } = await client.getToken(code)
    const idToken = tokens.id_token

    if (!idToken) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?google_error=no_id_token`
      )
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: getGoogleClientId(),
    })

    const payload = ticket.getPayload()
    const email = payload?.email

    if (!email || email !== getAdminEmail()) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?google_error=unauthorized_email`
      )
    }

    const sessionToken = createSession('google', email)

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?token=${sessionToken}`
    )
  } catch {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin?google_error=verification_failed`
    )
  }
}
