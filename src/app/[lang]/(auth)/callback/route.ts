import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { getGeoByIp } from '@/entities/listing'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? `/${lang}/dashboard`

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.redirect(`${origin}/${lang}/auth/auth-code-error`)
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options: _ }) =>
            request.cookies.set(name, value)
          )
        },
      },
    })

    const { error: sessionError } =
      await supabase.auth.exchangeCodeForSession(code)

    if (!sessionError) {
      // Log Access
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          const forwarded = request.headers.get('x-forwarded-for')
          const ip = forwarded ? (forwarded.split(',')[0] ?? '').trim() : null
          const geo = await getGeoByIp(ip)

          await supabase.from('access_logs').insert({
            user_id: user.id,
            ip_address: ip || 'unknown',
            country: geo.country,
            city: geo.city,
          })
        }
      } catch (err) {
        console.error('Failed to log access during callback:', err)
      }

      // Ensure next path is localized if it's an internal path
      const redirectUrl =
        next.startsWith('/') && !next.startsWith(`/${lang}`)
          ? `${origin}/${lang}${next === '/' ? '' : next}`
          : `${origin}${next}`

      return NextResponse.redirect(redirectUrl)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/${lang}/auth/auth-code-error`)
}
