import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '@/entities/listing/api'

const { mockFrom, mockRpc, mockSupabase } = vi.hoisted(() => {
  const mockFrom = vi.fn()
  const mockRpc = vi.fn()
  const mockSupabase = {
    from: mockFrom,
    rpc: mockRpc,
  }
  return { mockFrom, mockRpc, mockSupabase }
})

vi.mock('@/shared/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
  supabase: mockSupabase,
}))

vi.mock('@/entities/listing/api/filters', () => ({
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

    it('catches and logs errors in getAll', async () => {
      mockFrom.mockImplementation(() => {
        throw new Error('Query error')
      })
      const response = await listingsApi.getAll()
      expect(response.error).toBe('Query error')
    })
  })

  describe('getAdminAll', () => {
    it('fetches all listings for admin', async () => {
      const mockData = [{ id: '1' }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getAdminAll()
      expect(response.data).toEqual(mockData)
    })

    it('handles errors in getAdminAll', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Admin error')
      })
      const res = await listingsApi.getAdminAll()
      expect(res.error).toBe('Admin error')
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

    it('handles errors in getCount', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Count error')
      })
      const res = await listingsApi.getCount()
      expect(res.error).toBe('Count error')
    })
  })

  describe('getPendingCount', () => {
    it('fetches pending count', async () => {
      const eqMock = vi.fn().mockResolvedValue({ count: 5, error: null })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getPendingCount()
      expect(response.data).toBe(5)
    })

    it('handles errors in getPendingCount', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Pending error')
      })
      const res = await listingsApi.getPendingCount()
      expect(res.error).toBe('Pending error')
    })
  })

  describe('getFeatured', () => {
    it('fetches highlighted listings', async () => {
      const mockData = [{ id: '1' }]
      const limitMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const eqMock2 = vi.fn().mockReturnValue({ order: orderMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getFeatured(5)
      expect(response.data).toEqual(mockData)
    })

    it('handles errors in getFeatured', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Featured error')
      })
      const res = await listingsApi.getFeatured()
      expect(res.error).toBe('Featured error')
    })
  })

  describe('getById', () => {
    it('fetches listing and increments views', async () => {
      const mockListing = { id: '1', views_count: 5 }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockListing, error: null })
      const builder: any = { maybeSingle: maybeSingleMock, eq: vi.fn() }
      builder.eq.mockReturnValue(builder)
      const selectMock = vi.fn().mockReturnValue(builder)

      const updateBuilder: any = {
        eq: vi.fn().mockResolvedValue({ error: null }),
      }
      const updateMock = vi.fn().mockReturnValue(updateBuilder)

      mockFrom.mockImplementation((table: string) => {
        if (table === 'listings')
          return { select: selectMock, update: updateMock } as any
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
      const builder: any = { maybeSingle: maybeSingleMock, eq: vi.fn() }
      builder.eq.mockReturnValue(builder)
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue(builder),
      } as any)

      const response = await listingsApi.getById('1')
      expect(response.error).toBe('Listing not found')
    })

    it('handles errors in getById', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('ID error')
      })
      const res = await listingsApi.getById('1')
      expect(res.error).toBe('ID error')
    })
  })

  describe('getForEdit', () => {
    it('fetches listing for edit', async () => {
      const mockData = { id: '1' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getForEdit('1')
      expect(response.data).toEqual(mockData)
    })

    it('returns error if not found in getForEdit', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock }),
        }),
      } as any)
      const res = await listingsApi.getForEdit('1')
      expect(res.error).toBe('Listing not found')
    })
  })

  describe('create', () => {
    it('creates listing if content valid', async () => {
      const mockListing = {
        title: 'Valid title',
        description: 'desc',
        location: 'Bratislava',
      }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })
      const selectMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })

      mockFrom.mockReturnValue({ insert: insertMock } as any)

      const response = await listingsApi.create(mockListing)
      expect(response.data?.id).toBe('1')
    })

    it('fails if content invalid', async () => {
      // Spam: 5+ same chars
      const response = await listingsApi.create({
        title: 'AAAAAA',
        description: 'desc',
        location: 'Bratislava',
      })
      expect(response.error).toBeTruthy()
    })

    it('handles errors in create', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Create error')
      })
      const res = await listingsApi.create({
        title: 'Valid Title',
        description: 'Valid Desc',
        location: 'Bratislava',
      })
      expect(res.error).toBe('Create error')
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

      const response = await listingsApi.update('1', {
        title: 'Updated title',
        location: 'Bratislava',
      })
      expect(response.data).toEqual(mockData)
    })

    it('fails if update validation fails', async () => {
      const response = await listingsApi.update('1', { title: 'AAAAAA' })
      expect(response.error).toBeTruthy()
    })

    it('handles update errors', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Update error')
      })
      const res = await listingsApi.update('1', {
        title: 'Valid Title',
        location: 'Bratislava',
      })
      expect(res.error).toBe('Update error')
    })

    it('returns error if update result is empty', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const selectMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ update: updateMock } as any)

      const response = await listingsApi.update('1', { title: 'Valid title' })
      expect(response.error).toBe('Listing not found or update failed')
    })
  })

  describe('delete', () => {
    it('deletes an individual listing', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ delete: deleteMock } as any)

      const response = await listingsApi.delete('1')
      expect(response.error).toBeNull()
    })

    it('handles delete errors', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Delete error')
      })
      const res = await listingsApi.delete('1')
      expect(res.error).toBe('Delete error')
    })
  })

  describe('getByUser', () => {
    it('fetches listings for a user', async () => {
      const mockData = [{ id: '1' }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getByUser('user-1')
      expect(response.data).toEqual(mockData)
    })

    it('handles getByUser errors', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('User error')
      })
      const res = await listingsApi.getByUser('1')
      expect(res.error).toBe('User error')
    })
  })

  describe('getForOwner', () => {
    it('fetches listing if user is owner', async () => {
      const mockData = { id: '1', user_id: 'owner-1' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })
      mockFrom.mockReturnValue({ select: selectMock } as any)

      const response = await listingsApi.getForOwner('1', 'owner-1')
      expect(response.data).toEqual(mockData)
    })

    it('returns error if not found in getForOwner', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock }),
          }),
        }),
      } as any)
      const res = await listingsApi.getForOwner('1', '2')
      expect(res.error).toBe('Listing not found')
    })

    it('handles errors in getForOwner', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Owner error')
      })
      const res = await listingsApi.getForOwner('1', '2')
      expect(res.error).toBe('Owner error')
    })
  })

  describe('incrementContactClicks', () => {
    it('calls rpc to increment clicks', async () => {
      mockRpc.mockResolvedValue({ error: null })
      const response = await listingsApi.incrementContactClicks('1')
      expect(response.data).toBe(true)
    })

    it('handles errors in incrementContactClicks', async () => {
      mockRpc.mockResolvedValueOnce({ error: { message: 'RPC Error' } })
      const res = await listingsApi.incrementContactClicks('1')
      expect(res.error).toBe('RPC Error')
    })
  })

  describe('promote', () => {
    it('calls promote_listing rpc', async () => {
      mockRpc.mockResolvedValue({ error: null })
      const response = await listingsApi.promote('1', 'top', 7, 10)
      expect(response.error).toBeNull()
    })

    it('handles promote errors', async () => {
      mockRpc.mockResolvedValueOnce({ error: { message: 'Promote error' } })
      const res = await listingsApi.promote('1', 'top', 7, 10)
      expect(res.error).toBe('Promote error')
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

    it('handles bulkDelete errors', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Bulk delete error')
      })
      const res = await listingsApi.bulkDelete(['1'])
      expect(res.error).toBe('Bulk delete error')
    })

    it('bulkUpdates status', async () => {
      const inMock = vi.fn().mockResolvedValue({ error: null })
      const updateMock = vi.fn().mockReturnValue({ in: inMock })
      mockFrom.mockReturnValue({ update: updateMock } as any)

      const response = await listingsApi.bulkUpdateStatus(['1', '2'], 'expired')
      expect(response.error).toBeNull()
    })

    it('handles bulkUpdateStatus errors', async () => {
      mockFrom.mockImplementationOnce(() => {
        throw new Error('Bulk update error')
      })
      const res = await listingsApi.bulkUpdateStatus(['1'], 'active')
      expect(res.error).toBe('Bulk update error')
    })
  })
})
