import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createErrorResponse,
  createSuccessResponse,
  getAuthenticatedClient,
  OPTIONS,
  corsHeaders,
} from '@/app/api/utils'
import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

// Mock env
// Mock env with mutable object for testing
const mockEnv = vi.hoisted(() => ({
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_ANON_KEY: 'fake-key',
}))

vi.mock('@/lib/env', () => ({
  env: mockEnv,
}))

// Mock Supabase JS
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

// Mock Next.js server components
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, init) => ({
      data,
      status: init?.status || 200,
      headers: init?.headers || {},
    })),
  },
}))

describe('API Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createErrorResponse', () => {
    it('creates a JSON response with error message and status', () => {
      createErrorResponse('Something went wrong', 400, { code: 'ERR' })
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: 'Something went wrong', details: { code: 'ERR' } },
        { status: 400, headers: corsHeaders }
      )
    })
  })

  describe('createSuccessResponse', () => {
    it('creates a JSON response with data and default status', () => {
      createSuccessResponse({ foo: 'bar' })
      expect(NextResponse.json).toHaveBeenCalledWith(
        { foo: 'bar' },
        { status: 200, headers: corsHeaders }
      )
    })

    it('creates a JSON response with data and custom status', () => {
      createSuccessResponse({ foo: 'bar' }, 201)
      expect(NextResponse.json).toHaveBeenCalledWith(
        { foo: 'bar' },
        { status: 201, headers: corsHeaders }
      )
    })
  })

  describe('getAuthenticatedClient', () => {
    const mockReq = (authHeader: string | null) => {
      const headers = new Headers()
      if (authHeader) headers.set('Authorization', authHeader)
      return { headers } as unknown as NextRequest
    }

    it('returns null if Authorization header is missing', () => {
      const result = getAuthenticatedClient(mockReq(null))
      expect(result).toBeNull()
    })

    it('returns null/undefined if token is missing in Bearer format', () => {
      const result = getAuthenticatedClient(mockReq('Bearer '))
      expect(result).toBeFalsy()
    })

    it('returns null if environment variables are missing', () => {
      // Test missing URL
      const originalUrl = mockEnv.SUPABASE_URL
      mockEnv.SUPABASE_URL = ''
      expect(getAuthenticatedClient(mockReq('Bearer valid'))).toBeNull()
      mockEnv.SUPABASE_URL = originalUrl

      // Test missing Key
      const originalKey = mockEnv.SUPABASE_ANON_KEY
      mockEnv.SUPABASE_ANON_KEY = ''
      expect(getAuthenticatedClient(mockReq('Bearer valid'))).toBeNull()
      mockEnv.SUPABASE_ANON_KEY = originalKey
    })

    it('returns a Supabase client if token and env vars are present', () => {
      const token = 'valid-token'
      getAuthenticatedClient(mockReq(`Bearer ${token}`))

      expect(createClient).toHaveBeenCalledWith(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
        expect.objectContaining({
          global: {
            headers: { Authorization: `Bearer ${token}` },
          },
        })
      )
    })
  })

  describe('OPTIONS', () => {
    it('returns an empty response with CORS headers', () => {
      OPTIONS()
      expect(NextResponse.json).toHaveBeenCalledWith(
        {},
        { headers: corsHeaders }
      )
    })
  })
})
