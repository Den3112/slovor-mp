import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { languages, fallbackLng } from '@/packages/i18n/settings'

function getLocale(request: NextRequest): string {
    const headers = { 'accept-language': request.headers.get('accept-language') || '' }
    const languagesList = new Negotiator({ headers }).languages()
    return match(languagesList, languages, fallbackLng)
}

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // 1. Check if pathname is missing locale
    const pathnameIsMissingLocale = languages.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    )

    // Redirect if missing locale (and not API/robots/sitemap)
    if (
        pathnameIsMissingLocale &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/robots.txt') &&
        !pathname.startsWith('/sitemap.xml')
    ) {
        const locale = getLocale(request)

        // Redirect to locale path
        return NextResponse.redirect(
            new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
        )
    }

    // 2. Update Session (Auth & RBAC)
    const response = await updateSession(request)

    // Extract locale from path to set header for server components
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
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
