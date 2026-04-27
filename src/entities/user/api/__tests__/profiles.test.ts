import { describe, it, expect, vi, beforeEach } from 'vitest'
import { profilesApi } from '..'
import { supabase } from '@/shared/lib/supabase/client'

const mockFrom = vi.mocked(supabase.from)

/**
 * Helper to create a fluent Supabase mock query that is thenable
 */
const createMockQuery = (resolvedValue: any = { data: null, error: null }) => {
  const query: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
  }
  Object.keys(query).forEach((k) => query[k].mockReturnValue(query))

  query.then = vi.fn().mockImplementation((onFulfilled: any) => {
    return Promise.resolve(onFulfilled(resolvedValue))
  })

  return query
}

describe('profilesApi', () => {
  const userId = 'user-123'

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getById', () => {
    it('returns profile for existing user', async () => {
      const mockProfile = { id: userId, display_name: 'Test User' }
      mockFrom.mockReturnValue(
        createMockQuery({ data: mockProfile, error: null })
      )

      const { data, error } = await profilesApi.getById(supabase, userId)
      expect(error).toBeNull()
      expect(data).toEqual(mockProfile)
    })

    it('returns error if profile not found', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: null }))

      const { data, error } = await profilesApi.getById(supabase, userId)
      expect(data).toBeNull()
      expect(error).toBe('Profile not found')
    })
  })

  describe('getOrCreate', () => {
    it('returns existing profile if it exists', async () => {
      const mockProfile = { id: userId, display_name: 'Existing' }
      mockFrom.mockReturnValue(
        createMockQuery({ data: mockProfile, error: null })
      )

      const { data } = await profilesApi.getOrCreate(supabase, userId)
      expect(data).toEqual(mockProfile)
    })

    it('returns default profile if it does not exist', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: null }))

      const { data } = await profilesApi.getOrCreate(supabase, userId, 'test@example.com')
      expect(data?.display_name).toBe('test')
    })
  })

  describe('update', () => {
    it('updates and returns the profile while stripping sensitive fields', async () => {
      const updates = { display_name: 'New Name', created_at: 'stripped' }
      const mockResult = { id: userId, display_name: 'New Name' }
      const query = createMockQuery({ data: mockResult, error: null })
      mockFrom.mockReturnValue(query)

      const { data, error } = await profilesApi.update(supabase, userId, updates as any)

      expect(error).toBeNull()
      expect(data).toEqual(mockResult)
      expect(query.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ id: userId, display_name: 'New Name' }),
        expect.any(Object)
      )
      const callArgs = query.upsert.mock.calls[0][0]
      expect(callArgs).not.toHaveProperty('created_at')
    })
  })

  describe('getStats', () => {
    it('calculates stats correctly', async () => {
      const mockListings = [
        { views: 10, is_active: true },
        { views: 20, is_active: false },
      ]

      const listingsQuery = createMockQuery({ data: mockListings, error: null })
      const favoritesQuery = createMockQuery({ count: 5, error: null })

      mockFrom
        .mockReturnValueOnce(listingsQuery)
        .mockReturnValueOnce(favoritesQuery)

      const { data } = await profilesApi.getStats(supabase, userId)
      expect(data?.totalViews).toBe(30)
      expect(data?.favoritesCount).toBe(5)
      expect(data?.totalListings).toBe(2)
      expect(data?.activeListings).toBe(1)
      expect(data?.avgViewsPerListing).toBe(15)
    })

    it('handles zero listings in stats', async () => {
      mockFrom
        .mockReturnValueOnce(createMockQuery({ data: [], error: null }))
        .mockReturnValueOnce(createMockQuery({ count: 0, error: null }))

      const { data } = await profilesApi.getStats(supabase, userId)
      expect(data?.totalListings).toBe(0)
      expect(data?.avgViewsPerListing).toBe(0)
    })
  })

  describe('getRecentActivity', () => {
    it('returns recent listings', async () => {
      const mockListings = [{ id: '1' }, { id: '2' }]
      mockFrom.mockReturnValue(
        createMockQuery({ data: mockListings, error: null })
      )

      const { data, error } = await profilesApi.getRecentActivity(supabase, userId)
      expect(error).toBeNull()
      expect(data).toHaveLength(2)
    })
  })

  describe('getAdminAll', () => {
    it('returns all profiles for admin', async () => {
      const mockProfiles = [{ id: '1' }, { id: '2' }]
      mockFrom.mockReturnValue(
        createMockQuery({ data: mockProfiles, error: null })
      )

      const { data, error } = await profilesApi.getAdminAll(supabase)
      expect(error).toBeNull()
      expect(data).toHaveLength(2)
    })
  })

  describe('error handling', () => {
    const dbError = { message: 'Database error' }

    it('catches and logs errors in getById', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: dbError }))
      const { error } = await profilesApi.getById(supabase, userId)
      expect(error).toBe(dbError.message)
    })

    it('catches errors in getOrCreate', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: dbError }))
      const { error } = await profilesApi.getOrCreate(supabase, userId)
      expect(error).toBe(dbError.message)
    })

    it('catches errors in update', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: dbError }))
      const { error } = await profilesApi.update(supabase, userId, {})
      expect(error).toBe(dbError.message)
    })

    it('handles failed update (no data)', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: null }))
      const { error } = await profilesApi.update(supabase, userId, {})
      expect(error).toBe('Profile update failed')
    })

    it('catches errors in getStats', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: dbError }))
      const { error } = await profilesApi.getStats(supabase, userId)
      expect(error).toBe(dbError.message)
    })

    it('catches errors in favorites part of getStats', async () => {
      mockFrom
        .mockReturnValueOnce(createMockQuery({ data: [], error: null }))
        .mockReturnValueOnce(createMockQuery({ count: null, error: dbError }))

      const { error } = await profilesApi.getStats(supabase, userId)
      expect(error).toBe(dbError.message)
    })

    it('catches errors in getRecentActivity', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: dbError }))
      const { error } = await profilesApi.getRecentActivity(supabase, userId)
      expect(error).toBe(dbError.message)
    })

    it('catches errors in getAdminAll', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: dbError }))
      const { error } = await profilesApi.getAdminAll(supabase)
      expect(error).toBe(dbError.message)
    })
  })
})
