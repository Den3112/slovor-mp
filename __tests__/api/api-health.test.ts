import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '@/lib/api/listings'
import { categoriesApi } from '@/lib/api/categories'
import { supabase } from '@/lib/supabase/client'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            delete: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn(),
            single: vi.fn(),
        })),
        storage: {
            from: vi.fn(() => ({
                upload: vi.fn(),
                getPublicUrl: vi.fn(),
                remove: vi.fn(),
            })),
        },
    },
}))

describe('API Health Checks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('listingsApi', () => {
        it('should have basic methods', () => {
            expect(listingsApi.getAll).toBeDefined()
            expect(listingsApi.getById).toBeDefined()
            expect(listingsApi.create).toBeDefined()
        })

        it('getAll should call supabase select', async () => {
            const mockData = [{ id: '1', title: 'Test' }]
            const fromSpy = vi.spyOn(supabase, 'from')

            // Need to complex mock the chain for getAll
            const mockQuery = {
                select: vi.fn().mockReturnThis(),
                eq: vi.fn().mockReturnThis(),
                or: vi.fn().mockReturnThis(),
                order: vi.fn().mockReturnThis(),
                range: vi.fn().mockReturnThis(),
                limit: vi.fn().mockReturnThis(),
                then: vi.fn().mockImplementation((cb) => cb({ data: mockData, error: null })),
            }
            fromSpy.mockReturnValue(mockQuery as any)

            const result = await listingsApi.getAll()
            expect(result.data).toEqual(mockData)
            expect(fromSpy).toHaveBeenCalledWith('listings')
        })
    })

    describe('categoriesApi', () => {
        it('should have getAll and getBySlug', () => {
            expect(categoriesApi.getAll).toBeDefined()
            expect(categoriesApi.getBySlug).toBeDefined()
        })
    })
})
