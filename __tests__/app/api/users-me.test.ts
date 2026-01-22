import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, PUT } from '@/app/api/users/me/route'
import { getAuthenticatedClient } from '@/app/api/utils'
import { NextRequest } from 'next/server'

vi.mock('@/app/api/utils', async (importOriginal) => {
    const actual = await importOriginal<typeof import('@/app/api/utils')>()
    return {
        ...actual,
        getAuthenticatedClient: vi.fn(),
    }
})

describe('API Users Me Route', () => {
    let mockSupabase: any
    let mockFrom: any

    beforeEach(() => {
        vi.clearAllMocks()

        mockFrom = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            then: (cb: any) => cb({ data: { id: 'p1' }, error: null })
        }

        mockSupabase = {
            from: vi.fn(() => mockFrom),
            auth: {
                getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'u1', email: 'e@mail.com' } }, error: null })
            }
        }
    })

    describe('GET', () => {
        it('returns profile if authenticated', async () => {
            vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)
            const req = new NextRequest('http://api/users/me')
            const res = await GET(req)
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.id).toBe('p1')
        })

        it('returns 401 if not auth', async () => {
            vi.mocked(getAuthenticatedClient).mockReturnValue(null)
            const req = new NextRequest('http://api/users/me')
            const res = await GET(req)
            expect(res.status).toBe(401)
        })

        it('returns basic user info if profile missing', async () => {
            vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)
            mockFrom.then = (cb: any) => cb({ data: null, error: { message: 'Missing' } })

            const req = new NextRequest('http://api/users/me')
            const res = await GET(req)
            const json = await res.json()

            expect(res.status).toBe(200)
            expect(json.id).toBe('u1')
            expect(json.email).toBe('e@mail.com')
        })
    })

    describe('PUT', () => {
        it('updates profile', async () => {
            vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)
            mockFrom.then = (cb: any) => cb({ error: null })

            const req = new NextRequest('http://api/users/me', { method: 'PUT', body: JSON.stringify({ name: 'New' }) })
            const res = await PUT(req)

            expect(res.status).toBe(200)
            expect(mockFrom.update).toHaveBeenCalledWith({ name: 'New' })
            expect(mockFrom.eq).toHaveBeenCalledWith('id', 'u1')
        })

        it('returns error on update fail', async () => {
            vi.mocked(getAuthenticatedClient).mockReturnValue(mockSupabase)
            mockFrom.then = (cb: any) => cb({ error: { message: 'Fail' } })

            const req = new NextRequest('http://api/users/me', { method: 'PUT', body: JSON.stringify({}) })
            const res = await PUT(req)

            expect(res.status).toBe(400)
        })
    })
})
