import { describe, it, expect, vi, beforeEach } from 'vitest'
import { serverCategoriesApi } from '../server'
import { createClient } from '@/shared/lib/supabase/server'

// Mock react cache
vi.mock('react', () => ({
  cache: vi.fn((fn) => fn),
}))

// Mock supabase server client
vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/shared/lib/utils/logger', () => ({
  logError: vi.fn(),
}))

describe('serverCategoriesApi', () => {
  const mockSupabase = {
    from: vi.fn(() => ({
      select: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(),
      order: vi.fn(),
    })),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockResolvedValue(mockSupabase)
  })

  describe('getAll', () => {
    it('fetches all categories and formats listing counts', async () => {
      const mockCategories = [
        { id: '1', name: 'Electronics', listings: [{ count: 10 }] },
        { id: '2', name: 'Real Estate', listings: [] },
      ]

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
      }
      ;(mockSupabase.from as any).mockReturnValue(mockChain)

      const result = await serverCategoriesApi.getAll()

      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]?.listing_count).toBe(10)
      expect(result.data?.[1]?.listing_count).toBe(0)
      expect(mockSupabase.from).toHaveBeenCalledWith('categories')
    })

    it('handles errors gracefully', async () => {
      ;(mockSupabase.from as any).mockImplementationOnce(() => {
        throw new Error('DB Error')
      })
      const result = await serverCategoriesApi.getAll()
      expect(result.error).toBe('DB Error')
    })
  })

  describe('getBySlug', () => {
    it('fetches category by slug and calculates listing count', async () => {
      const mockCategory = { id: '1', name: 'Electronics', slug: 'electronics' }

      const mockCategoryChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValue({ data: mockCategory, error: null }),
      }

      // Mocking the second call specifically
      const eq2 = vi.fn().mockResolvedValue({ count: 15, error: null })
      const eq1 = vi.fn().mockReturnValue({ eq: eq2 })
      const select2 = vi.fn().mockReturnValue({ eq: eq1 })

      ;(mockSupabase.from as any)
        .mockReturnValueOnce(mockCategoryChain)
        .mockReturnValueOnce({ select: select2 })

      const result = await serverCategoriesApi.getBySlug('electronics')

      expect(result.data?.id).toBe('1')
      expect(result.data?.listing_count).toBe(15)
    })

    it('returns error if category not found', async () => {
      const mockCategoryChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      ;(mockSupabase.from as any).mockReturnValueOnce(mockCategoryChain)

      const result = await serverCategoriesApi.getBySlug('missing')

      expect(result.error).toBe('Category not found')
    })
  })
})
