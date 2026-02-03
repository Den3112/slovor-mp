import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { languages, fallbackLng } from '@/packages/i18n/settings'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'



function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' }
    const languagesList = new Negotiator({ headers }).languages()
    return match(languagesList, languages, fallbackLng)
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // 1. Check if pathname is missing locale
    const pathnameIsMissingLocale = languages.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    if (
        pathnameIsMissingLocale &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next') &&
        pathname !== '/favicon.ico'
    ) {
        const locale = getLocale(request)
        return NextResponse.redirect(
            new URL(`/${locale}${pathname}`, request.url)
        )
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

    return response
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
         */
        '/((?!_next/static|_next/image|favicon.ico|api|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
