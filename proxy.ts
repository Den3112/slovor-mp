import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { languages, fallbackLng } from '@/packages/i18n/settings'

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' }
    const languagesStack = new Negotiator({ headers }).languages()
    return match(languagesStack, languages, fallbackLng)
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Language Detection & Rewriting
    // Check if locale is present in path
    const pathnameHasLocale = languages.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    let response: NextResponse;

    if (pathnameHasLocale) {
        // Current locale is in URL, e.g. /sk/about
        const locale = languages.find((l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`)
        const remainingPath = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

        // Rewrite to the internal path (flat app structure), e.g. /about
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-slovor-locale', locale || fallbackLng)

        const url = request.nextUrl.clone()
        url.pathname = remainingPath

        response = NextResponse.rewrite(url, {
            request: {
                headers: requestHeaders
            }
        })
    } else {
        const isPublic =
            pathname.startsWith('/_next') ||
            pathname.includes('.') ||
            pathname.startsWith('/api') ||
            pathname.startsWith('/supabase')

        if (!isPublic && pathname === '/') {
            const locale = getLocale(request)
            if (locale) {
                return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
            }
        }

        response = NextResponse.next()
    }

    // 2. Supabase Session (with Locale-Aware RBAC)
    return await updateSession(request, response)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
