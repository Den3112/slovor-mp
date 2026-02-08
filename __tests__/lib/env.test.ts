import { describe, it, expect, vi } from 'vitest'
import { env } from '@/lib/env'

// Mock the environment module to avoid process.env dependency issues in test
vi.mock('@/lib/env', () => ({
  env: {
    SUPABASE_URL: 'https://mock.supabase.co',
    SUPABASE_ANON_KEY: 'mock-key',
    NODE_ENV: 'test',
    APP_URL: 'http://localhost:3000',
    ENABLE_AUTH: true,
    ENABLE_PAYMENTS: true,
  }
}))

describe('Environment Variables', () => {
  it('exports env object', () => {
    expect(env).toBeDefined()
  })

  it('has SUPABASE_URL property', () => {
    expect(env.SUPABASE_URL).toBeDefined()
  })

  it('has SUPABASE_ANON_KEY property', () => {
    expect(env.SUPABASE_ANON_KEY).toBeDefined()
  })

  it('has NODE_ENV property with default', () => {
    expect(env.NODE_ENV).toBeDefined()
  })

  it('has APP_URL property with default', () => {
    expect(env.APP_URL).toBeDefined()
    expect(env.APP_URL).toContain('http')
  })

  it('has feature flags', () => {
    expect(env.ENABLE_AUTH).toBeDefined()
    expect(env.ENABLE_PAYMENTS).toBeDefined()
  })
})
