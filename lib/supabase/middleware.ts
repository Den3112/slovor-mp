import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // Ignore OPTIONS requests for session updates
    if (request.method === 'OPTIONS') {
        return NextResponse.next()
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Basic validation of env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
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
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
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
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // This will refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser()

    // -------------------------------------------------------------------------
    // RBAC & Route Protection
    // -------------------------------------------------------------------------

    const path = request.nextUrl.pathname;

    // 1. Admin Routes Protection
    if (path.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/', request.url))
        }

        // Check Role
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (!profile || profile.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    // 2. Protected User Routes
    if (
        !user &&
        (path.startsWith('/post') ||
            path.startsWith('/profile'))
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login' // Redirect to login, assuming /auth/login exists or /login
        // The previous proxy.ts used /login. Existing app might use /auth/login or /login.
        // I see /auth/login in app/profile/layout.tsx redirect (Step 51). So /auth/login is likely correct.
        // proxy.ts used /login (Step 112). This is inconsistent. I will use /auth/login as seen in layout.tsx.

        // Check if /login exists in file list? Step 6 didn't show /login. It showed app/auth/login likely?
        // Step 9 for profile layout used '/auth/login'.
        return NextResponse.redirect(url)
    }

    // 3. Redirect to profile if logged in and trying to access auth pages
    if (user && path.startsWith('/auth')) {
        const url = request.nextUrl.clone()
        url.pathname = '/profile'
        return NextResponse.redirect(url)
    }

    return response
}
