import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoriesApi } from '..'
import { supabase } from '@/shared/lib/supabase/client'

const mockFrom = vi.mocked(supabase.from)

/**
 * Helper to create a fluent Supabase mock query that is thenable
 */
const createMockQuery = (resolvedValue: any = { data: [], error: null }) => {
  const query: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
  }

  query.then = vi.fn().mockImplementation((onFulfilled) => {
    return Promise.resolve(onFulfilled(resolvedValue))
  })

  return query
}

describe('categoriesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAll', () => {
    it('fetches all categories and formats listing counts', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          listings: [{ count: 5 }],
        },
        { id: '2', name: 'Real Estate', slug: 'real-estate', listings: [] },
      ]

      mockFrom.mockReturnValue(
        createMockQuery({ data: mockCategories, error: null })
      )

      const { data, error } = await categoriesApi.getAll()

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.[0]?.listing_count).toBe(5)
    })
  })

  describe('getBySlug', () => {
    it('fetches single category and its listing count', async () => {
      const mockCategory = { id: 'cat-1', name: 'Music', slug: 'music' }

      mockFrom
        .mockReturnValueOnce(
          createMockQuery({ data: mockCategory, error: null })
        )
        .mockReturnValueOnce(createMockQuery({ count: 42, error: null }))

      const { data, error } = await categoriesApi.getBySlug('music')

      expect(error).toBeNull()
      expect(data).not.toBeNull()
      expect(data?.listing_count).toBe(42)
      expect(mockFrom).toHaveBeenCalledWith('categories')
      expect(mockFrom).toHaveBeenCalledWith('listings')
    })

    it('returns "Not Found" if category does not exist', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: null, error: null }))

      const { error } = await categoriesApi.getBySlug('unknown')
      expect(error).toBe('Category not found')
    })
  })

  describe('create', () => {
    it('inserts a new category', async () => {
      mockFrom.mockReturnValue(
        createMockQuery({ data: { id: 'new-id' }, error: null })
      )

      const { data } = await categoriesApi.create({
        name: 'New',
        slug: 'new',
      } as any)
      expect(data?.id).toBe('new-id')
    })
  })

  describe('update', () => {
    it('updates existing category', async () => {
      mockFrom.mockReturnValue(
        createMockQuery({ data: { id: '1', name: 'Updated' }, error: null })
      )

      const { data } = await categoriesApi.update('1', { name: 'Updated' })
      expect(data?.name).toBe('Updated')
    })
  })

  describe('delete', () => {
    it('deletes category', async () => {
      mockFrom.mockReturnValue(createMockQuery({ error: null }))

      const { error } = await categoriesApi.delete('1')
      expect(error).toBeNull()
    })
  })
})
