import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { languages, fallbackLng } from '@/packages/i18n/settings'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { ipAddress } from '@vercel/functions'
/**
 * Gets the most appropriate locale for the request
 * Priority: 1. Cookie, 2. Accept-Language header, 3. Fallback
 */
function getLocale(request: NextRequest): string {
  // 1. Check cookie first (user's explicit choice)
  const cookieLocale = request.cookies.get('slovor-locale')?.value
  if (cookieLocale && languages.includes(cookieLocale as any)) {
    return cookieLocale
  }

  // 2. Check browser language preferences
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languagesFromHeader = new Negotiator({
    headers: negotiatorHeaders,
  }).languages()

  try {
    return match(languagesFromHeader, languages, fallbackLng)
  } catch (e) {
    return fallbackLng
  }
}

// 6. Rate Limit Configuration
const isRateLimitConfigured =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

const ratelimit = isRateLimitConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(50, '60 s'),
      analytics: true,
      prefix: '@upstash/ratelimit/slovor',
    })
  : null

export default async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // 1. Check if pathname is missing locale
    const pathnameIsMissingLocale = languages.every(
      (locale) =>
        !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (pathnameIsMissingLocale) {
      // Skip API, Next.js vitals/statics, and files with extensions
      const isPublic =
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')

      if (!isPublic) {
        const locale = getLocale(request)

        // Redirect to the URL with locale prefix
        return NextResponse.redirect(
          new URL(
            `/${locale}${pathname === '/' ? '' : pathname}${request.nextUrl.search}`,
            request.url
          )
        )
      }
    }

    // 2. Update Session
    const response = await updateSession(request)

    // 3. Set locale header for server components
    const locale = languages.find(
      (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
    )

    if (locale) {
      response.headers.set('x-slovor-locale', locale)
    }

    // 4. Secure CSP with Nonce
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
    const cspHeader = `
        default-src 'self';
        script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://va.vercel-scripts.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com https://res.cloudinary.com https://picsum.photos https://fastly.picsum.photos;
        font-src 'self' data: https://fonts.gstatic.com;
        connect-src 'self' https://*.supabase.co wss://*.supabase.co https://open.er-api.com https://vitals.vercel-insights.com https://api.stripe.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
        upgrade-insecure-requests;
      `
      .replace(/\s{2,}/g, ' ')
      .trim()

    // Pass nonce via request header for server components (not response header)
    response.headers.set('x-nonce', nonce)
    response.headers.set('Content-Security-Policy', cspHeader)
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), browsing-topics=()'
    )

    // 5. Rate limiting (Security Fix: Real Implementation)
    if (pathname.startsWith('/api/') && !pathname.startsWith('/api/webhooks')) {
      const ip = ipAddress(request) || '127.0.0.1'

      if (ratelimit) {
        const { success, limit, reset, remaining } = await ratelimit.limit(
          `ratelimit_${ip}`
        )

        response.headers.set('X-RateLimit-Limit', limit.toString())
        response.headers.set('X-RateLimit-Remaining', remaining.toString())
        response.headers.set('X-RateLimit-Reset', reset.toString())

        if (!success) {
          return NextResponse.json(
            { error: 'Too Many Requests', message: 'Rate limit exceeded' },
            {
              status: 429,
              headers: response.headers,
            }
          )
        }
      } else {
        // Fallback for local development or missing keys
        response.headers.set('X-RateLimit-Limit', '100')
        response.headers.set('X-RateLimit-Warning', 'Upstash not configured')
      }
    }

    return response
  } catch (error: any) {
    console.error('Middleware Error:', error)
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     * - api (API routes)
     * - files with extensions (svg, png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
