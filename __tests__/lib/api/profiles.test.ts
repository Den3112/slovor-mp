import { describe, it, expect, vi, beforeEach } from 'vitest'
import { profilesApi } from '@/lib/api/profiles'
import { supabase } from '@/lib/supabase/client'

describe('profilesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getById', () => {
    it('fetches profile by id', async () => {
      const mockProfile = { id: '1', display_name: 'Test User' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockProfile, error: null })
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getById('1')
      expect(response.error).toBeNull()
      expect(response.data).toEqual(mockProfile)
    })

    it('returns error if profile not found', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getById('1')
      expect(response.error).toBe('Profile not found')
    })

    it('handles db error', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB Error' } })
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getById('1')
      expect(response.error).toBe('DB Error')
    })
  })

  describe('getOrCreate', () => {
    it('returns existing profile', async () => {
      const mockProfile = { id: '1', display_name: 'Existing' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockProfile, error: null })
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getOrCreate('1')
      expect(response.data).toEqual(mockProfile)
    })

    it('returns default profile if not found', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const eqMock = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getOrCreate('1', 'test@example.com')
      expect(response.data?.id).toBe('1')
      expect(response.data?.display_name).toBe('test')
    })
  })

  describe('update', () => {
    it('upserts profile', async () => {
      const mockProfile = { id: '1', display_name: 'Updated' }
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockProfile, error: null })
      const selectMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const upsertMock = vi.fn().mockReturnValue({ select: selectMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { upsert: upsertMock } as any
        return {} as any
      })

      const response = await profilesApi.update('1', {
        display_name: 'Updated',
      })
      expect(response.error).toBeNull()
      expect(response.data).toEqual(mockProfile)
      expect(upsertMock).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', display_name: 'Updated' }),
        expect.objectContaining({ onConflict: 'id' })
      )
    })

    it('handles failure in update', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Update Failed' } })
      const selectMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const upsertMock = vi.fn().mockReturnValue({ select: selectMock })

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'profiles') return { upsert: upsertMock } as any
        return {} as any
      })

      const response = await profilesApi.update('1', {})
      expect(response.error).toBe('Update Failed')
    })
  })

  describe('getStats', () => {
    it('calculates profile statistics correctly', async () => {
      const mockListings = [
        { views: 10, is_active: true },
        { views: 20, is_active: true },
        { views: 5, is_active: false },
      ]

      // Mock listings query
      const listingsEqMock = vi
        .fn()
        .mockResolvedValue({ data: mockListings, error: null })
      const listingsSelectMock = vi.fn().mockReturnValue({ eq: listingsEqMock })

      // Mock favorites query
      const favoritesEqMock = vi
        .fn()
        .mockResolvedValue({ count: 15, error: null })
      const favoritesSelectMock = vi
        .fn()
        .mockReturnValue({ eq: favoritesEqMock })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'listings') return { select: listingsSelectMock } as any
        if (table === 'favorites') return { select: favoritesSelectMock } as any
        return {} as any
      })

      const response = await profilesApi.getStats('user-1')

      expect(response.error).toBeNull()
      expect(response.data).not.toBeNull()
      expect(response.data!.totalListings).toBe(3)
      expect(response.data!.activeListings).toBe(2)
      expect(response.data!.inactiveListings).toBe(1)
      expect(response.data!.totalViews).toBe(35)
      expect(response.data!.favoritesCount).toBe(15)
      // 35 / 3 = 11.66 -> 12
      expect(response.data!.avgViewsPerListing).toBe(12)
    })

    it('handles errors when fetching listings', async () => {
      const listingsEqMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB Error' } })
      const listingsSelectMock = vi.fn().mockReturnValue({ eq: listingsEqMock })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'listings') return { select: listingsSelectMock } as any
        return {} as any
      })

      const response = await profilesApi.getStats('user-1')
      expect(response.error).toBe('DB Error')
      expect(response.data).toBeNull()
    })
  })

  describe('getRecentActivity', () => {
    it('fetches recent listings', async () => {
      const mockListings = [{ id: '1', title: 'Listing 1' }]

      const limitMock = vi
        .fn()
        .mockResolvedValue({ data: mockListings, error: null })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'listings') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getRecentActivity('user-1')

      expect(response.error).toBeNull()
      expect(response.data).toEqual(mockListings)
    })

    it('handles errors', async () => {
      const limitMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Fetch Fail' } })
      const orderMock = vi.fn().mockReturnValue({ limit: limitMock })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'listings') return { select: selectMock } as any
        return {} as any
      })

      const response = await profilesApi.getRecentActivity('user-1')
      expect(response.error).toBe('Fetch Fail')
    })
  })
})
