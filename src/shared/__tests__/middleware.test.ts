import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateSession } from '@/shared/lib/supabase/middleware'
import { NextResponse } from 'next/server'

// Mock Supabase Chain
const mockSingle = vi.fn()
const mockEq = vi.fn(() => ({ single: mockSingle }))
const mockSelect = vi.fn(() => ({ eq: mockEq }))
const mockFrom = vi.fn(() => ({ select: mockSelect }))
const mockGetUser = vi.fn()

const mockSupabase = {
  auth: {
    getUser: mockGetUser,
  },
  from: mockFrom,
}

// Mock Supabase SSR
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => mockSupabase),
}))

// Mock Next.js server components
vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn().mockReturnValue({
      headers: new Headers(),
      cookies: { set: vi.fn(), get: vi.fn() },
    }),
    redirect: vi.fn().mockImplementation((url) => ({
      status: 307,
      url: url instanceof URL ? url.toString() : url,
    })),
  },
}))

vi.mock('@/shared/lib/config', () => ({
  config: {
    app: {
      adminEmails: ['admin@example.com'],
    },
  },
}))

describe('middleware utility', () => {
  const mockRequest = (pathname: string) => {
    const urlObj = new URL('http://localhost:3000' + pathname)
    return {
      method: 'GET',
      nextUrl: {
        pathname,
        clone: function () {
          return new URL('http://localhost:3000' + pathname)
        },
      },
      cookies: {
        get: vi.fn(),
        set: vi.fn(),
        getAll: vi.fn(() => []),
      },
      headers: new Headers(),
      url: urlObj.toString(),
    } as any
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Default: Guest
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    mockSingle.mockResolvedValue({ data: null, error: null })
  })

  it('allows access to public route if not authenticated', async () => {
    const req = mockRequest('/')
    await updateSession(req)
    expect(NextResponse.next).toHaveBeenCalled()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('redirects to /auth/login if user is not authenticated on protected route (/dashboard)', async () => {
    const req = mockRequest('/dashboard')
    await updateSession(req)
    expect(NextResponse.redirect).toHaveBeenCalled()
  })

  it('redirects to /dashboard if user is authenticated on auth route', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } }, error: null })
    const req = mockRequest('/login')
    await updateSession(req)
    expect(NextResponse.redirect).toHaveBeenCalled()
  })

  it('redirects guests attempting to access /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null })
    const req = mockRequest('/admin')
    await updateSession(req)
    expect(NextResponse.redirect).toHaveBeenCalled()
  })

  it('redirects non-admin users attempting to access /admin', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: '1' } }, error: null })
    mockSingle.mockResolvedValue({ data: { role: 'user' }, error: null }) // Not admin

    const req = mockRequest('/admin')
    await updateSession(req)
    expect(NextResponse.redirect).toHaveBeenCalled()
  })

  it('allows admin users to access /admin', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-id' } },
      error: null,
    })
    mockSingle.mockResolvedValue({ data: { role: 'admin' }, error: null })

    const req = mockRequest('/admin')
    await updateSession(req)

    // Should NOT redirect, should call next()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
    expect(NextResponse.next).toHaveBeenCalled()
  })

  it('bypasses session update for OPTIONS requests', async () => {
    const req = {
      method: 'OPTIONS',
      nextUrl: { pathname: '/any' },
    } as any
    await updateSession(req)
    expect(NextResponse.next).toHaveBeenCalled()
    expect(mockGetUser).not.toHaveBeenCalled()
  })

  it('allows admin access via fallback email list', async () => {
    const adminEmail = 'admin@example.com'
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'admin-id', email: adminEmail } },
      error: null,
    })
    mockSingle.mockResolvedValue({ data: { role: 'user' }, error: null })

    const req = mockRequest('/admin')
    await updateSession(req)

    expect(NextResponse.next).toHaveBeenCalled()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })
})
