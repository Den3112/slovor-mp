import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST } from '@/app/api/listings/route'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Mock Supabase
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn()
}))

// NOTE: We need to mock getAuthenticatedClient in the route file or mock the util it imports ??
// Since api/listings/route.ts imports from '../utils', we can mock '../utils'.
vi.mock('@/app/api/utils', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/app/api/utils')>()
    return {
        ...actual,
        getAuthenticatedClient: vi.fn(),
        createSuccessResponse: actual.createSuccessResponse,
        createErrorResponse: actual.createErrorResponse,
    }
})

import { getAuthenticatedClient } from '@/app/api/utils'

describe('API Listings Route', () => {
    let mockSupabase: any
    let mockFrom: any

    beforeEach(() => {
        vi.clearAllMocks()

        // Setup Supabase Chain Mock
        mockFrom = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            ilike: vi.fn().mockReturnThis(),
            gte: vi.fn().mockReturnThis(),
            lte: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            range: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            then: (cb: any) => cb({ data: [], count: 0, error: null })
        }

        mockSupabase = {
            from: vi.fn(() => mockFrom),
            auth: {
                getUser: vi.fn()
            }
        }

        vi.mocked(createClient).mockReturnValue(mockSupabase)
    })

    describe('GET', () => {
        it('fetches listings with default params', async () => {
            const req = new NextRequest('http://localhost/api/listings')
            const res = await GET(req)
            await res.json()

            expect(res.status).toBe(200)
            expect(mockFrom.eq).toHaveBeenCalledWith('status', 'active')
            expect(mockFrom.range).toHaveBeenCalledWith(0, 9) // Default limit 10, page 1
        })

        it('applies search filters', async () => {
            const req = new NextRequest('http://localhost/api/listings?search=car&min_price=100')
            await GET(req)

            expect(mockFrom.ilike).toHaveBeenCalledWith('title', '%car%')
            expect(mockFrom.gte).toHaveBeenCalledWith('price', '100')
        })

        it('handles db error', async () => {
            mockFrom.then = (cb: any) => cb({ data: null, error: { message: 'DB Error' } })
            const req = new NextRequest('http://localhost/api/listings')
            const res = await GET(req)

            expect(res.status).toBe(500)
        })
    })

    describe('POST', () => {
        it('returns 401 if unauthenticated', async () => {
            vi.mocked(getAuthenticatedClient).mockReturnValue(null)
            const req = new NextRequest('http://localhost/api/listings', { method: 'POST', body: JSON.stringify({}) })
            const res = await POST(req)
            expect(res.status).toBe(401)
        })

        it('creates listing successfully', async () => {
            // Setup auth mock
            mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })

            // Setup db response
            const mockListing = { id: 'l1', title: 'New' }
            mockFrom.then = (cb: any) => cb({ data: mockListing, error: null })

            vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)

            const req = new NextRequest('http://localhost/api/listings', {
                method: 'POST',
                body: JSON.stringify({ title: 'New' })
            })

            const res = await POST(req)
            const json = await res.json()

            expect(res.status).toBe(201)
            expect(json.listing_id).toBe('l1')
            expect(mockFrom.insert).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New',
                user_id: 'u1',
                status: 'active'
            }))
        })
    })
})
