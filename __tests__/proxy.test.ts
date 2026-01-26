import { describe, it, expect, vi } from 'vitest'
import { updateSession } from '@/lib/supabase/proxy'
import { NextRequest } from 'next/server'

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
    },
  })),
}))

describe('Auth Middleware', () => {
  it('should redirect to login if no user and accessing protected path', async () => {
    const { createServerClient } = await import('@supabase/ssr')
      ; (createServerClient as any).mockReturnValue({
        auth: {
          getUser: vi
            .fn()
            .mockResolvedValue({ data: { user: null }, error: null }),
        },
      })

    const request = new NextRequest(new URL('http://localhost:3000/profile'))
    const response = await updateSession(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/login')
  })

  it('should not redirect if user exists', async () => {
    const { createServerClient } = await import('@supabase/ssr')
      ; (createServerClient as any).mockReturnValue({
        auth: {
          getUser: vi
            .fn()
            .mockResolvedValue({ data: { user: { id: '1' } }, error: null }),
        },
      })

    const request = new NextRequest(new URL('http://localhost:3000/profile'))
    const response = await updateSession(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })
})
