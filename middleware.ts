import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware runs before every request to your application.
 *
 * CURRENT STATE: Pass-through (no auth yet)
 * FUTURE: Will check authentication and redirect unauthorized users
 *
 * HOW IT WORKS:
 * 1. User visits /dashboard or /create-listing
 * 2. Middleware checks if user is authenticated (via Supabase session)
 * 3. If NOT authenticated → redirect to /login
 * 4. If authenticated → allow access
 *
 * WHEN TO USE:
 * - Protecting pages that require login
 * - Role-based access control
 * - Rate limiting (future)
 * - Analytics tracking (future)
 */
export async function middleware(request: NextRequest) {
  // Simple check for auth token in cookies for protected routes
  // Note: This is a basic check. For full security use supabase auth helpers in middleware
  // const hasAuthCookie = request.cookies.has('sb-access-token') || request.cookies.has('sb-refresh-token') || request.cookies.toString().includes('supabase-auth-token');

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/post')) {
    // If we don't have a cookie, we might not be logged in.
    // However, with client-side only auth it's hard to check on server without proper cookie setup.
    // For now, we will allow access and handle redirect on client side if no user found in AuthContext,
    // OR we rely on the fact that supabase js sets cookies if configured.
    // Note: Since we haven't fully set up @supabase/ssr, strict server middleware might block valid client sessions.
    // So we will Skip strict redirect here and let the Client Component handle it,
    // unless we are sure.
    // let's leave it open for now and handle in the Page component via AuthContext
  }

  return NextResponse.next()
}

/**
 * Configure which routes should run middleware
 *
 * EXPLANATION:
 * - matcher: Array of route patterns to match
 * - '/dashboard/:path*' = /dashboard and all subroutes (/dashboard/settings, etc.)
 * - '/create-listing' = Only this exact route
 * - '/api/private/:path*' = All private API routes (future)
 *
 * DOES NOT RUN ON:
 * - Public pages (/, /listings, /categories)
 * - Static files (_next/static, images, fonts)
 * - API routes not in matcher
 */
export const config = {
  matcher: [
    '/dashboard/:path*', // User dashboard and subroutes
    '/post', // Create new listing page
    '/create-listing', // Old route
    '/edit-listing/:path*', // Edit listing pages (future)
    '/favorites', // Favorites page (future)
    '/messages/:path*', // Messages (future)
    '/api/private/:path*', // Private API routes (future)
  ],
}
