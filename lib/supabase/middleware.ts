import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { languages } from '@/packages/i18n/settings'

export async function updateSession(
  request: NextRequest,
  existingResponse?: NextResponse
) {
  // Ignore OPTIONS requests for session updates
  if (request.method === 'OPTIONS') {
    return NextResponse.next()
  }

  let response =
    existingResponse ||
    NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        response = NextResponse.next()
        response.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        response = NextResponse.next()
        response.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  // This will refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // -------------------------------------------------------------------------
  // RBAC & Route Protection
  // -------------------------------------------------------------------------

  let path = request.nextUrl.pathname

  // Check for locale in path and strip it for RBAC checks
  const currentLocale = languages.find(
    (locale) => path.startsWith(`/${locale}/`) || path === `/${locale}`
  )

  // Normalize path for RBAC (remove locale)
  if (currentLocale) {
    path = path.replace(new RegExp(`^/${currentLocale}`), '') || '/'
  }

  // Helper to preserve locale in redirects
  const getRedirectUrl = (targetPath: string) => {
    const localePrefix = currentLocale ? `/${currentLocale}` : ''
    return new URL(`${localePrefix}${targetPath}`, request.url)
  }

  // 1. Admin Routes Protection
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(getRedirectUrl('/'))
    }

    // Check Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // Fallback for E2E or recovery
      const { config } = await import('@/lib/config')
      if (!config.app.adminEmails.includes(user.email || '')) {
        return NextResponse.redirect(getRedirectUrl('/'))
      }
    }
  }

  // 2. Protected User Routes
  if (!user && (path.startsWith('/post') || path.startsWith('/dashboard'))) {
    // Redirect to login
    // Assuming /auth/login is the correct path for login
    // Preserving the original behavior but adding locale support
    const redirectUrl = getRedirectUrl('/auth/login')
    return NextResponse.redirect(redirectUrl)
  }

  // 3. Redirect to profile if logged in and trying to access auth pages
  if (user && path.startsWith('/auth')) {
    const redirectUrl = getRedirectUrl('/dashboard')
    return NextResponse.redirect(redirectUrl)
  }

  return response
}
