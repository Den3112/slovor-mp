import { describe, it, expect } from 'vitest'
import { env } from '@/lib/env'

describe('Environment Variables', () => {
  it('exports env object', () => {
    expect(env).toBeDefined()
  })

  it('has SUPABASE_URL property', () => {
    expect(env).toHaveProperty('SUPABASE_URL')
  })

  it('has SUPABASE_ANON_KEY property', () => {
    expect(env).toHaveProperty('SUPABASE_ANON_KEY')
  })

  it('has NODE_ENV property with default', () => {
    expect(env.NODE_ENV).toBeDefined()
  })

  it('has APP_URL property with default', () => {
    expect(env.APP_URL).toBeDefined()
    expect(env.APP_URL).toContain('http')
  })

  it('has feature flags as booleans', () => {
    expect(typeof env.ENABLE_AUTH).toBe('boolean')
    expect(typeof env.ENABLE_PAYMENTS).toBe('boolean')
  })
})
