import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('env utility logic', () => {

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('correctly identifies dev and prod environments', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-key')

    const { env } = await import('@/lib/env')
    expect(env.isDev).toBe(true)
    expect(env.isProd).toBe(false)
  })

  it('correctly identifies production environment', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://live.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'live-key')

    const { env } = await import('@/lib/env')
    expect(env.isProd).toBe(true)
    expect(env.isDev).toBe(false)
  })

  it('splits ADMIN_EMAILS correctly', async () => {
    process.env.ADMIN_EMAILS = 'a@test.com, b@test.com '
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

    const { env } = await import('@/lib/env')
    expect(env.ADMIN_EMAILS).toEqual(['a@test.com', 'b@test.com'])
  })

  it('uses default ADMIN_EMAILS if not provided', async () => {
    delete process.env.ADMIN_EMAILS
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'

    const { env } = await import('@/lib/env')
    expect(env.ADMIN_EMAILS).toEqual(['admin@slovor.sk'])
  })

  it('handles invalid env vars gracefully in development', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    // @ts-ignore
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', undefined)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { env } = await import('@/lib/env')

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid environment variables'),
      expect.any(Object)
    )
    // Should fallback to raw processEnv values
    expect(env.NODE_ENV).toBe('development')
    consoleSpy.mockRestore()
  })
})
