import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient, createStaticClient } from '@/shared/lib/supabase/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

// Mock next/headers
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(),
}))

describe('Supabase Server Client', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'fake-key'
  })

  describe('createClient', () => {
    it('throws an error when environment variables are missing', async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(),
      }
      ;(cookies as any).mockResolvedValue(mockCookieStore)

      // Should throw missing env error
      await expect(createClient()).rejects.toThrow(
        'Missing Supabase environment variables'
      )
    })

    it('creates a client with cookie access', async () => {
      const mockCookieStore = {
        getAll: vi
          .fn()
          .mockReturnValue([{ name: 'sb-access-token', value: 'token' }]),
        set: vi.fn(),
      }
      ;(cookies as any).mockResolvedValue(mockCookieStore)

      await createClient()

      expect(createServerClient).toHaveBeenCalledWith(
        'https://example.supabase.co',
        'fake-key',
        expect.objectContaining({
          cookies: expect.any(Object),
        })
      )

      // Test cookie methods passed to createServerClient
      const config = (createServerClient as any).mock.calls[0][2]

      // Test getAll
      const allCookies = config.cookies.getAll()
      expect(allCookies).toEqual([{ name: 'sb-access-token', value: 'token' }])

      // Test setAll
      config.cookies.setAll([{ name: 'test', value: 'val', options: {} }])
      expect(mockCookieStore.set).toHaveBeenCalledWith('test', 'val', {})
    })

    it('handles setAll error when called from Server Component', async () => {
      const mockCookieStore = {
        getAll: vi.fn().mockReturnValue([]),
        set: vi.fn(() => {
          throw new Error('Cannot set cookies in Server Component')
        }),
      }
      ;(cookies as any).mockResolvedValue(mockCookieStore)

      await createClient()
      const config = (createServerClient as any).mock.calls[0][2]

      // Should not throw
      expect(() =>
        config.cookies.setAll([{ name: 'test', value: 'val' }])
      ).not.toThrow()
    })
  })

  describe('createStaticClient', () => {
    it('creates a client without cookie access', () => {
      createStaticClient()

      expect(createServerClient).toHaveBeenCalledWith(
        'https://example.supabase.co',
        'fake-key',
        expect.objectContaining({
          cookies: expect.any(Object),
        })
      )

      const config = (createServerClient as any).mock.calls[0][2]
      expect(config.cookies.getAll()).toEqual([])

      // setAll should be a no-op
      expect(() => config.cookies.setAll()).not.toThrow()
    })

    it('throws an error when environment variables are missing', () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      // Should throw missing env error
      expect(() => createStaticClient()).toThrow(
        'Missing Supabase environment variables'
      )
    })
  })
})
