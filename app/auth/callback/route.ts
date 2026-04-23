import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorCode = searchParams.get('error_code')
  const errorDescription = searchParams.get('error_description')
  
  // if "next" is in search params, use it as the redirection URL after successful sign in
  const next = searchParams.get('next') ?? '/dashboard'

  if (error) {
    return NextResponse.redirect(`${origin}/verify-email?error=${error}&error_code=${errorCode}&error_description=${errorDescription}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (!exchangeError) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    return NextResponse.redirect(`${origin}/verify-email?error=exchange_error&error_description=${encodeURIComponent(exchangeError.message)}`)
  }

  // Fallback
  return NextResponse.redirect(`${origin}/verify-email`)
}
