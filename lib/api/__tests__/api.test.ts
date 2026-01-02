/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '@/lib/api/listings'
import { categoriesApi } from '@/lib/api/categories'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => {
    const mockReturnThis = () => mockChain
    const mockChain = {
        select: vi.fn(mockReturnThis),
        insert: vi.fn(mockReturnThis),
        update: vi.fn(mockReturnThis),
        delete: vi.fn(mockReturnThis),
        eq: vi.fn(mockReturnThis),
        order: vi.fn(mockReturnThis),
        limit: vi.fn(mockReturnThis),
        single: vi.fn(),
        range: vi.fn(mockReturnThis),
        gte: vi.fn(mockReturnThis),
        lte: vi.fn(mockReturnThis),
        ilike: vi.fn(mockReturnThis),
        or: vi.fn(mockReturnThis),
    }

    return {
        supabase: {
            from: vi.fn(() => mockChain),
        },
    }
})

describe('Listings API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('listingsApi.getAll', () => {
        it('should fetch all listings successfully', async () => {
            const mockListings = [
                {
                    id: '1',
                    title: 'Test Listing',
                    price: 100,
                    category_id: 'cat1',
                    user_id: 'user1',
                    location: 'Bratislava',
                    is_active: true,
                    views: 0,
                },
            ]

            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({ data: mockListings, error: null })

            const result = await listingsApi.getAll()

            expect(result.error).toBeNull()
            expect(result.data).toBeDefined()
        })

        it('should handle errors gracefully', async () => {
            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({
                data: null,
                error: new Error('Database error'),
            })

            const result = await listingsApi.getAll()

            expect(result.data).toEqual([])
            expect(result.error).toBeDefined()
        })
    })

    describe('listingsApi.create', () => {
        it('should create a new listing', async () => {
            const newListing = {
                title: 'New Listing',
                description: 'Test description',
                price: 200,
                category_id: 'cat1',
                user_id: 'user1',
                location: 'Bratislava',
                condition: 'new' as const,
                images: [],
                currency: 'EUR',
                featured: false,
                metadata: null,
            }

            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({
                data: { ...newListing, id: '123' },
                error: null,
            })

            const result = await listingsApi.create(newListing)

            expect(result.error).toBeNull()
            expect(result.data).toBeDefined()
        })
    })

    describe('listingsApi.update', () => {
        it('should update an existing listing', async () => {
            const updates = { title: 'Updated Title', price: 300 }

            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({
                data: { id: '123', ...updates },
                error: null,
            })

            const result = await listingsApi.update('123', updates)

            expect(result.error).toBeNull()
            expect(result.data).toBeDefined()
        })
    })

    describe('listingsApi.delete', () => {
        it('should delete a listing', async () => {
            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({ data: null, error: null })

            const result = await listingsApi.delete('123')

            expect(result.error).toBeNull()
        })
    })
})

describe('Categories API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('categoriesApi.getAll', () => {
        it('should fetch all categories', async () => {
            const mockCategories = [
                {
                    id: 'cat1',
                    name: 'Electronics',
                    slug: 'electronics',
                    description: 'Electronic devices',
                    icon: null,
                    icon_name: 'Laptop',
                    color: '#3b82f6',
                    order_index: 1,
                    created_at: new Date().toISOString(),
                },
            ]

            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({
                data: mockCategories,
                error: null,
            })

            const result = await categoriesApi.getAll()

            expect(result.error).toBeNull()
            expect(result.data).toBeDefined()
        })
    })

    describe('categoriesApi.getBySlug', () => {
        it('should fetch category by slug', async () => {
            const mockCategory = {
                id: 'cat1',
                name: 'Electronics',
                slug: 'electronics',
                description: 'Electronic devices',
                icon: null,
                icon_name: 'Laptop',
                color: '#3b82f6',
                order_index: 1,
                created_at: new Date().toISOString(),
            }

            const { supabase } = await import('@/lib/supabase/client')
            const mockFrom = supabase.from as any
            mockFrom().single.mockResolvedValue({ data: mockCategory, error: null })

            const result = await categoriesApi.getBySlug('electronics')

            expect(result.error).toBeNull()
            expect(result.data).toBeDefined()
        })
    })
})
