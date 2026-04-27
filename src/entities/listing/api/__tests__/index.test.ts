import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '../index'
import { supabase } from '@/shared/lib/supabase/client'
import { MOCK_LISTINGS } from '../mock-listings'

const mockFrom = vi.mocked(supabase.from)

/**
 * Helper to create a fluent Supabase mock query that is thenable
 */
const createMockQuery = (resolvedValue: any = { data: [], error: null }) => {
  const query: any = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    maybeSingle: vi.fn(),
    single: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    in: vi.fn(),
    gte: vi.fn(),
    lte: vi.fn(),
    or: vi.fn(),
    range: vi.fn(),
    upsert: vi.fn(),
  }
  Object.keys(query).forEach((k) => query[k].mockReturnValue(query))

  query.then = vi.fn().mockImplementation((onFulfilled) => {
    return Promise.resolve(onFulfilled(resolvedValue))
  })

  return query
}

describe('listingsApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAll', () => {
    it('fetches listings and handles successful response', async () => {
      const mockData = [{ id: '1', title: 'Test' }]
      const query = createMockQuery({ data: mockData, error: null })
      mockFrom.mockReturnValueOnce(query)

      const { data, error } = await listingsApi.getAll(supabase as any, { search: 'iphone' })
      expect(error).toBeNull()
      expect(data).toEqual(mockData)
      expect(query.or).toHaveBeenCalled()
    })

    it('falls back to mock listings on credential error', async () => {
      mockFrom.mockReturnValueOnce(
        createMockQuery({
          data: null,
          error: { message: 'default credentials' },
        })
      )

      const { data } = await listingsApi.getAll(supabase as any)
      expect(data).toEqual(MOCK_LISTINGS)
    })
  })

  describe('getById', () => {
    it('fetches listing and increments views_count', async () => {
      const mockListing = { id: '1', views_count: 10 }
      const selectQuery = createMockQuery({ data: mockListing, error: null })
      const updateQuery = createMockQuery({ error: null })

      mockFrom.mockReturnValueOnce(selectQuery).mockReturnValueOnce(updateQuery)

      const { data } = await listingsApi.getById(supabase as any, '1')
      expect(data).toEqual(mockListing)
      expect(updateQuery.update).toHaveBeenCalledWith({ views_count: 11 })
    })
  })

  describe('create', () => {
    it('validates and inserts listing', async () => {
      const newListing = {
        title: 'Valid Listing Title',
        description: 'This is a long enough description.',
        location: 'Bratislava',
      }
      mockFrom.mockReturnValueOnce(
        createMockQuery({ data: { id: 'new', ...newListing }, error: null })
      )

      const { data, error } = await listingsApi.create(supabase as any, newListing)
      expect(error).toBeNull()
      expect(data?.id).toBe('new')
    })

    it('returns error on failed content validation (moderation check)', async () => {
      // Use a known banned pattern from content-filter.ts (e.g., Slovak profanity)
      const badListing = { title: 'kokot', description: 'some description' }
      const { data, error } = await listingsApi.create(supabase as any, badListing)
      expect(data).toBeNull()
      expect(error).toContain('vulgárne slová')
    })
  })

  describe('bulk operations', () => {
    it('bulkDelete calls delete with in filter', async () => {
      const query = createMockQuery({ error: null })
      mockFrom.mockReturnValueOnce(query)

      await listingsApi.bulkDelete(supabase as any, ['1', '2'])
      expect(query.delete).toHaveBeenCalled()
      expect(query.in).toHaveBeenCalledWith('id', ['1', '2'])
    })

    it('bulkUpdateStatus calls update with in filter', async () => {
      const query = createMockQuery({ error: null })
      mockFrom.mockReturnValueOnce(query)

      await listingsApi.bulkUpdateStatus(supabase as any, ['1'], 'sold')
      expect(query.update).toHaveBeenCalled()
      expect(query.in).toHaveBeenCalledWith('id', ['1'])
    })
  })
})
