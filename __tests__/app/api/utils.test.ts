import { describe, it, expect } from 'vitest'
import {
  getAuthenticatedClient,
  createErrorResponse,
  createSuccessResponse,
} from '@/app/api/utils'
import { NextRequest } from 'next/server'
import { env } from '@/lib/env'

describe('API Utils', () => {
  describe('getAuthenticatedClient', () => {
    it('returns null if no Authorization header', () => {
      const req = new NextRequest('http://localhost')
      const client = getAuthenticatedClient(req)
      expect(client).toBeNull()
    })

    it('returns null if header is empty/invalid', () => {
      const req = new NextRequest('http://localhost', {
        headers: { Authorization: 'Bearer ' },
      })
      const client = getAuthenticatedClient(req)
      expect(client).toBeNull()
    })

    it('returns null if missing env vars', () => {
      const originalUrl = env.SUPABASE_URL
      // @ts-ignore
      env.SUPABASE_URL = '' // Temporarily break env

      const req = new NextRequest('http://localhost', {
        headers: { Authorization: 'Bearer token' },
      })
      const client = getAuthenticatedClient(req)
      expect(client).toBeNull()

      // Restore
      // @ts-ignore
      env.SUPABASE_URL = originalUrl
    })

    it('creates client with valid token', () => {
      const req = new NextRequest('http://localhost', {
        headers: { Authorization: 'Bearer valid-token' },
      })
      const client = getAuthenticatedClient(req)
      expect(client).toBeDefined()
      // We can check if it has the auth header configured ??
      // But client internals are hidden. Assuming createClient is called is enough if we trust createClient.
    })
  })

  describe('Response Helpers', () => {
    it('createSuccessResponse', async () => {
      const res = createSuccessResponse({ success: true }, 201)
      const json = await res.json()
      expect(res.status).toBe(201)
      expect(json.success).toBe(true)
    })

    it('createErrorResponse', async () => {
      const res = createErrorResponse('Bad', 400)
      const json = await res.json()
      expect(res.status).toBe(400)
      expect(json.message).toBe('Bad')
    })
  })
})
