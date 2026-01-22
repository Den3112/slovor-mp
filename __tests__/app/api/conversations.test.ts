import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/messages/conversations/route'
import { getAuthenticatedClient } from '@/app/api/utils'
import { NextRequest } from 'next/server'

// Mock utils
vi.mock('@/app/api/utils', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/app/api/utils')>()
    return {
        ...actual,
        getAuthenticatedClient: vi.fn(),
    }
})

describe('API Conversations Route', () => {
    let mockSupabase: any
    let mockFrom: any

    beforeEach(() => {
        vi.clearAllMocks()

        mockFrom = {
            select: vi.fn().mockReturnThis(),
            or: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            then: (cb: any) => cb({ data: [], error: null })
        }

        mockSupabase = {
            from: vi.fn(() => mockFrom),
            auth: {
                getUser: vi.fn()
            }
        }
    })

    it('returns 401 if not authenticated', async () => {
        vi.mocked(getAuthenticatedClient).mockReturnValue(null)
        const req = new NextRequest('http://localhost/api/messages/conversations')
        const res = await GET(req)
        expect(res.status).toBe(401)
    })

    it('returns 401 if user fetch fails', async () => {
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })
        vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)

        const req = new NextRequest('http://localhost/api/messages/conversations')
        const res = await GET(req)
        expect(res.status).toBe(401)
    })

    it('fetches conversations successfully', async () => {
        const userId = 'u1'
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })
        vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)

        const mockData = [{ id: 'c1' }]
        mockFrom.then = (cb: any) => cb({ data: mockData, error: null })

        const req = new NextRequest('http://localhost/api/messages/conversations')
        const res = await GET(req)
        const json = await res.json()

        expect(res.status).toBe(200)
        expect(json).toEqual(mockData)
        expect(mockFrom.or).toHaveBeenCalledWith(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    })

    it('handles complex query error by trying fallback', async () => {
        const userId = 'u1'
        mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: userId } }, error: null })
        vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)

        // First call fails
        mockFrom.then = vi.fn()
            .mockImplementationOnce((cb: any) => cb({ data: null, error: { message: 'Relation Error' } }))
            .mockImplementationOnce((cb: any) => cb({ data: [{ id: 'fallback' }], error: null }))

        const req = new NextRequest('http://localhost/api/messages/conversations')
        const res = await GET(req)
        const json = await res.json()

        // Should succeed with fallback data
        expect(res.status).toBe(200)
        expect(json[0].id).toBe('fallback')
        // select should have been called twice (once with relations, once with '*')
        expect(mockFrom.select).toHaveBeenCalledTimes(2)
    })
})
