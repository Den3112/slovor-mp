import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '@/lib/api/listings'
const { mockFrom, mockRpc, mockSupabase } = vi.hoisted(() => {
  const mockFrom = vi.fn()
  const mockRpc = vi.fn()
  const mockSupabase = {
    from: mockFrom,
    rpc: mockRpc,
  }
  return { mockFrom, mockRpc, mockSupabase }
})

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
  supabase: mockSupabase, // if used directly
}))

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
      const eqMock = vi.fn().mockReturnValue({
        then: (r: any) => r({ data: mockData, error: null }),
      })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getAll({})
      expect(response.data).toEqual(mockData)
    })
  })

  describe('getCount', () => {
    it('fetches count', async () => {
      const eqMock = vi
        .fn()
        .mockReturnValue({ then: (r: any) => r({ count: 10, error: null }) })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getCount({})
      expect(response.data).toBe(10)
    })
  })

  describe('getById', () => {
    it('fetches listing and increments views', async () => {
      const mockListing = { id: '1', views_count: 5, views: 5 } // Both for compatibility checks
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockListing, error: null })
      const builder: any = {
        maybeSingle: maybeSingleMock,
        eq: vi.fn(),
      }
      builder.eq.mockReturnValue(builder)

      const selectMock = vi.fn().mockReturnValue(builder)

      // Mock update for view increment
      const updateBuilder: any = {
        eq: vi.fn(),
      }
      updateBuilder.eq.mockResolvedValue({ error: null })

      const updateMock = vi.fn().mockReturnValue(updateBuilder)

      mockFrom.mockImplementation((table: string) => {
        if (table === 'listings') {
          return {
            select: selectMock,
            update: updateMock,
          } as any
        }
        return {} as any
      })

      const response = await listingsApi.getById('1')

      expect(response.data).toEqual(mockListing)
      expect(updateMock).toHaveBeenCalledWith({ views_count: 6 })
    })

    it('returns error if not found', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const eqMock = vi.fn().mockReturnValue({
        maybeSingle: maybeSingleMock,
        eq: vi.fn().mockReturnThis(),
      })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getById('1')
      expect(response.error).toBe('Listing not found')
    })
  })

  describe('create', () => {
    it('creates listing if content valid', async () => {
      const mockListing = { title: 'Valid' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1', ...mockListing }, error: null })
      const selectMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })

      mockFrom.mockReturnValue({ insert: insertMock } as any)

      const response = await listingsApi.create(mockListing)
      expect(response.data?.id).toBe('1')
    })

    it('fails if content invalid', async () => {
      // "AAAAA" is caught as spam (repeated chars)
      const response = await listingsApi.create({ title: 'AAAAA' })
      expect(response.error).toBeTruthy()
    })
  })

  describe('getAdminAll', () => {
    it('fetches all listings for admin', async () => {
      const mockData = [{ id: '1', profiles: { role: 'admin' } }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getAdminAll()
      expect(response.data).toEqual(mockData)
    })
  })

  describe('getFeatured', () => {
    it('fetches highlighted listings', async () => {
      const mockData = [{ id: '1', is_highlighted: true }]
      const limitMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const eqMock = vi
        .fn()
        .mockReturnValue({ eq: vi.fn().mockReturnValue({ order: orderMock }) })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getFeatured(5)
      expect(response.data).toEqual(mockData)
    })
  })

  describe('update', () => {
    it('updates listing if valid', async () => {
      const mockData = { id: '1', title: 'Updated' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const selectMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ update: updateMock } as any)

      const response = await listingsApi.update('1', { title: 'Updated' })
      expect(response.data).toEqual(mockData)
    })

    it('fails if update validation fails', async () => {
      const response = await listingsApi.update('1', { title: 'AAAAA' })
      expect(response.error).toBeTruthy()
    })
  })

  describe('bulk operations', () => {
    it('bulkDeletes listings', async () => {
      const inMock = vi.fn().mockResolvedValue({ error: null })
      const deleteMock = vi.fn().mockReturnValue({ in: inMock })
      mockFrom.mockReturnValue({ delete: deleteMock } as any)

      const response = await listingsApi.bulkDelete(['1', '2'])
      expect(response.error).toBeNull()
    })

    it('bulkUpdates status', async () => {
      const inMock = vi.fn().mockResolvedValue({ error: null })
      const updateMock = vi.fn().mockReturnValue({ in: inMock })
      mockFrom.mockReturnValue({ update: updateMock } as any)

      const response = await listingsApi.bulkUpdateStatus(['1', '2'], 'expired')
      expect(response.error).toBeNull()
    })
  })

  describe('error handling', () => {
    it('catches and logs errors in getAll', async () => {
      mockFrom.mockImplementation(() => {
        throw new Error('Query error')
      })
      const response = await listingsApi.getAll()
      expect(response.error).toBe('Query error')
    })
  })

  describe('promote', () => {
    it('calls promote_listing rpc', async () => {
      mockRpc.mockResolvedValue({ error: null })
      const response = await listingsApi.promote('1', 'top', 7, 10)
      expect(response.error).toBeNull()
      expect(mockRpc).toHaveBeenCalledWith(
        'promote_listing',
        expect.any(Object)
      )
    })
  })
})
