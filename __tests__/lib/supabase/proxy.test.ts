import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateSession } from '@/lib/supabase/proxy'
import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

// Mock Next.js server components
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn().mockReturnValue({
      headers: new Headers(),
      cookies: { set: vi.fn(), get: vi.fn() },
    }),
    redirect: vi.fn().mockImplementation((url) => ({
      status: 302,
      url,
    })),
  },
}))

describe('middleware utility', () => {
  const mockRequest = (pathname: string) =>
    ({
      nextUrl: {
        pathname,
        clone: function (this: any) {
          const self = this
          return {
            get pathname() {
              return self.pathname
            },
            set pathname(val) {
              self.pathname = val
            },
            toString() {
              return self.pathname
            },
          }
        },
      },
      cookies: {
        get: vi.fn(),
        set: vi.fn(),
      },
      headers: new Headers(),
    }) as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to /login if user is not authenticated on protected route', async () => {
    ; (createServerClient as any).mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    })

    const req = mockRequest('/profile')
    const result = await updateSession(req)

    expect(NextResponse.redirect).toHaveBeenCalled()
    expect((result as any).url.pathname).toBe('/login')
  })

  it('redirects to /profile if user is authenticated on auth route', async () => {
    ; (createServerClient as any).mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
      },
    })

    const req = mockRequest('/auth/login')
    const result = await updateSession(req)

    expect(NextResponse.redirect).toHaveBeenCalled()
    expect((result as any).url.pathname).toBe('/profile')
  })

  it('allows access to public route if not authenticated', async () => {
    ; (createServerClient as any).mockReturnValue({
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: null }, error: null }),
      },
    })

    const req = mockRequest('/')
    await updateSession(req) // result unused

    expect(NextResponse.next).toHaveBeenCalled()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('handles cookie setting and removal inside createServerClient options', async () => {
    let cookieMethods: any
      ; (createServerClient as any).mockImplementation(
        (_url: string, _key: string, options: any) => {
          cookieMethods = options.cookies
          return {
            auth: {
              getUser: vi
                .fn()
                .mockResolvedValue({ data: { user: null }, error: null }),
            },
          }
        }
      )

    const req = mockRequest('/')
    await updateSession(req)

    // Trigger set
    cookieMethods.set('test', 'val', {})
    expect(req.cookies.set).toHaveBeenCalled()

    // Trigger remove
    cookieMethods.remove('test', {})
    expect(req.cookies.set).toHaveBeenCalledWith(
      expect.objectContaining({ value: '' })
    )
  })
})
