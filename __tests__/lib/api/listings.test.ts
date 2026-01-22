import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '@/lib/api/listings'
import { supabase } from '@/lib/supabase/client'

// vi.mock('@/lib/moderation') removed to use real implementation

vi.mock('@/lib/api/listings/filters', () => ({
    applyListingFilters: vi.fn((q) => q),
    applyListingSorting: vi.fn((q) => q),
    applyListingPagination: vi.fn((q) => q),
}))

describe('listingsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getAll', () => {
        it('fetches listings', async () => {
            const mockData = [{ id: '1' }]
            const eqMock = vi.fn().mockReturnValue({ then: (r: any) => r({ data: mockData, error: null }) })
            const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
            vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

            const response = await listingsApi.getAll({})
            expect(response.data).toEqual(mockData)
        })
    })

    describe('getCount', () => {
        it('fetches count', async () => {
            const eqMock = vi.fn().mockReturnValue({ then: (r: any) => r({ count: 10, error: null }) })
            const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
            vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

            const response = await listingsApi.getCount({})
            expect(response.data).toBe(10)
        })
    })

    describe('getById', () => {
        it('fetches listing and increments views', async () => {
            const mockListing = { id: '1', views: 5 }
            const maybeSingleMock = vi.fn().mockResolvedValue({ data: mockListing, error: null })
            const builder: any = {
                maybeSingle: maybeSingleMock,
                eq: vi.fn(),
            }
            builder.eq.mockReturnValue(builder)

            const selectMock = vi.fn().mockReturnValue(builder)

            // Mock update for view increment
            const updateBuilder: any = {
                eq: vi.fn()
            }
            updateBuilder.eq.mockResolvedValue({ error: null })

            const updateMock = vi.fn().mockReturnValue(updateBuilder)

            vi.mocked(supabase.from).mockImplementation((table) => {
                if (table === 'listings') {
                    return {
                        select: selectMock,
                        update: updateMock
                    } as any
                }
                return {} as any
            })

            const response = await listingsApi.getById('1')

            expect(response.data).toEqual(mockListing)
            expect(updateMock).toHaveBeenCalledWith({ views: 6 })
        })

        it('returns error if not found', async () => {
            const maybeSingleMock = vi.fn().mockResolvedValue({ data: null, error: null })
            const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock, eq: vi.fn().mockReturnThis() })
            const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
            vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

            const response = await listingsApi.getById('1')
            expect(response.error).toBe('Listing not found')
        })
    })

    describe('create', () => {
        it('creates listing if content valid', async () => {
            const mockListing = { title: 'Valid' }
            const maybeSingleMock = vi.fn().mockResolvedValue({ data: { id: '1', ...mockListing }, error: null })
            const selectMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
            const insertMock = vi.fn().mockReturnValue({ select: selectMock })

            vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

            const response = await listingsApi.create(mockListing)
            expect(response.data?.id).toBe('1')
        })

        it('fails if content invalid', async () => {
            // "AAAAA" is caught as spam (repeated chars)
            const response = await listingsApi.create({ title: 'AAAAA' })
            expect(response.error).toBeTruthy()
        })
    })

    describe('incrementContactClicks', () => {
        it('calls rpc', async () => {
            vi.mocked(supabase.rpc).mockResolvedValue({ error: null } as any)
            const response = await listingsApi.incrementContactClicks('1')
            expect(response.data).toBe(true)
            expect(supabase.rpc).toHaveBeenCalledWith('increment_contact_clicks', { listing_id: '1' })
        })
    })

    describe('delete', () => {
        it('deletes listing', async () => {
            const eqMock = vi.fn().mockResolvedValue({ error: null })
            const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
            vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as any)

            const response = await listingsApi.delete('1')
            expect(response.data).toBeNull()
            expect(response.error).toBeNull()
        })
    })
})
