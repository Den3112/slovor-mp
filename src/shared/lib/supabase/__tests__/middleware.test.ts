import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateSession } from '@/shared/lib/supabase/middleware'
import { NextRequest } from 'next/server'
import * as ssr from '@supabase/ssr'

// Mock dependencies
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

vi.mock('@/shared/lib/env', () => ({
  env: {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-key',
  },
}))

vi.mock('@/shared/lib/config', () => ({
  config: {
    app: {
      adminEmails: ['admin@example.com'],
    },
  },
}))

describe('updateSession Middleware', () => {
  const mockRequest = (path: string, method = 'GET') => {
    return new NextRequest(new URL(`http://localhost:3000${path}`), { method })
  }

  const mockSupabase = (user: any = null, role: string = 'user') => {
    const fromMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { role }, error: null }),
    })

    return {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }),
      },
      from: fromMock,
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should skip session update for OPTIONS requests', async () => {
    const request = mockRequest('/', 'OPTIONS')
    const response = await updateSession(request)
    expect(response.headers.get('x-middleware-next')).toBe('1')
  })

  it('should redirect legacy /messages to /dashboard/messages', async () => {
    const request = mockRequest('/messages')
    vi.mocked(ssr.createServerClient).mockReturnValue(mockSupabase() as any)

    const response = await updateSession(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/dashboard/messages')
  })

  it('should redirect legacy /favorites to /dashboard/favorites', async () => {
    const request = mockRequest('/favorites')
    vi.mocked(ssr.createServerClient).mockReturnValue(mockSupabase() as any)

    const response = await updateSession(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/dashboard/favorites')
  })

  it('should handle cookie set/get/remove in Supabase client', async () => {
    const request = mockRequest('/')
    await updateSession(request)

    expect(ssr.createServerClient).toHaveBeenCalled()
    const options = vi.mocked(ssr.createServerClient).mock.calls[0]?.[2] as any
    if (!options) {
      throw new Error('Expected createServerClient to be called with options')
    }
    expect(options.cookies).toBeDefined()

    options.cookies.get('test-cookie')
    options.cookies.set('name', 'val', {})
    options.cookies.remove('name', {})
  })

  it('should handle lang prefix in paths', async () => {
    const request = mockRequest('/sk/post')
    vi.mocked(ssr.createServerClient).mockReturnValue(mockSupabase(null) as any)

    const response = await updateSession(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(
      'http://localhost:3000/sk/login'
    )
  })

  it('should protect /admin route from non-admin users', async () => {
    const request = mockRequest('/admin')
    vi.mocked(ssr.createServerClient).mockReturnValue(
      mockSupabase({ id: '1', email: 'user@test.com' }, 'user') as any
    )

    const response = await updateSession(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/')
  })

  it('should redirect /admin to root if user is not logged in', async () => {
    const request = mockRequest('/admin')
    vi.mocked(ssr.createServerClient).mockReturnValue(mockSupabase(null) as any)

    const response = await updateSession(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe('http://localhost:3000/')
  })

  it('should allow /admin access for admins verified by DB role', async () => {
    const request = mockRequest('/admin')
    vi.mocked(ssr.createServerClient).mockReturnValue(
      mockSupabase({ id: '1' }, 'admin') as any
    )

    const response = await updateSession(request)
    expect(response.status).toBe(200)
  })

  it('should allow /admin access via fallback adminEmails list', async () => {
    const request = mockRequest('/admin')
    vi.mocked(ssr.createServerClient).mockReturnValue(
      mockSupabase({ id: '1', email: 'admin@example.com' }, 'user') as any
    )

    const response = await updateSession(request)
    expect(response.status).toBe(200)
  })

  it('should handle auth.getUser() failure gracefully', async () => {
    const request = mockRequest('/')
    const supabase = mockSupabase()
    supabase.auth.getUser = vi.fn().mockRejectedValue(new Error('Auth failed'))
    vi.mocked(ssr.createServerClient).mockReturnValue(supabase as any)

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const response = await updateSession(request)

    expect(warnSpy).toHaveBeenCalled()
    expect(response.status).toBe(200)
    warnSpy.mockRestore()
  })
})
