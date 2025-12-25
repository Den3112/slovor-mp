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
export function middleware(request: NextRequest) {
  // TODO: Uncomment when Supabase Auth is implemented
  // const supabaseResponse = NextResponse.next()
  // const supabase = createMiddlewareClient({ req: request, res: supabaseResponse })
  // const { data: { session } } = await supabase.auth.getSession()
  
  // if (!session) {
  //   return NextResponse.redirect(new URL('/login', request.url))
  // }
  
  // For now, allow all requests
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
    '/dashboard/:path*',     // User dashboard and subroutes
    '/create-listing',       // Create new listing page
    '/edit-listing/:path*',  // Edit listing pages (future)
    '/favorites',            // Favorites page (future)
    '/messages/:path*',      // Messages (future)
    '/api/private/:path*',   // Private API routes (future)
  ],
}
