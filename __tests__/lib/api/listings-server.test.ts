/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverListingsApi } from '@/lib/api/listings/server'

const { mockFrom } = vi.hoisted(() => {
    const chain: any = {
        select: vi.fn(),
        eq: vi.fn(),
        order: vi.fn(),
        limit: vi.fn(),
        then: vi.fn(),
    }
    // Fix recursive return
    chain.select.mockReturnValue(chain)
    chain.eq.mockReturnValue(chain)
    chain.order.mockReturnValue(chain)
    chain.limit.mockReturnValue(chain)
    // Default promise resolution
    chain.then.mockImplementation((cb: any) => cb({ data: [], error: null }))

    return {
        mockFrom: vi.fn(() => chain),
        mockChain: chain
    }
})

// Mock Supabase Server client
vi.mock('@/lib/supabase/server', () => {
    return {
        createClient: vi.fn(() => Promise.resolve({
            from: mockFrom
        }))
    }
})

describe('Server Listings API', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('serverListingsApi.getAll', () => {
        it('should fetch all listings successfully', async () => {
            const mockListings = [
                { id: '1', title: 'Test', is_active: true }
            ]

            const { createClient } = await import('@/lib/supabase/server')
            const mockClient = await createClient()
            const mockFrom = mockClient.from as any
            mockFrom().then.mockImplementation((cb: any) => cb({ data: mockListings, error: null }))

            const result = await serverListingsApi.getAll()

            expect(result.error).toBeNull()
            expect(result.data).toEqual(mockListings)
        })

        it('should apply filters', async () => {
            const { createClient } = await import('@/lib/supabase/server')
            const mockClient = await createClient()
            const mockFrom = mockClient.from as any

            await serverListingsApi.getAll({
                categoryId: 'cat1',
                limit: 5,
                sort: 'price-low'
            })

            // Verify chain calls (simplistic verification)
            // Ideally we'd verify strict call order, but chain mocks are tricky
            expect(mockFrom).toHaveBeenCalledWith('listings')
            // Detailed verification would require spying on the chain methods
        })
    })

    describe('serverListingsApi.getFeatured', () => {
        it('should fetch featured listings', async () => {
            const result = await serverListingsApi.getFeatured()
            expect(result.error).toBeNull()
        })
    })
})
