import { describe, it, expect, vi, beforeEach } from 'vitest'
import { favoritesApi } from '@/entities/favorite/api'
import { supabase } from '@/shared/lib/supabase/client'

// Mock dependencies
vi.mock('@/shared/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(),
      insert: vi.fn(),
      delete: vi.fn(),
      eq: vi.fn(),
      maybeSingle: vi.fn(),
      order: vi.fn(),
    })),
  },
}))

vi.mock('@/shared/lib/utils/logger', () => ({
  logError: vi.fn(),
}))

describe('favoritesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getByUser', () => {
    it('fetches and flattens favorited listings', async () => {
      const mockData = [
        { listing: { id: 'l1', title: 'Listing 1' } },
        { listing: { id: 'l2', title: 'Listing 2' } },
        { listing: null }, // should be filtered out
      ]
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      const result = await favoritesApi.getByUser('user-1')

      expect(result.data).toHaveLength(2)
      expect(result.data?.[0]?.id).toBe('l1')
      expect(result.data?.[1]?.id).toBe('l2')
    })
  })

  describe('toggle', () => {
    it('removes from favorites if already exists', async () => {
      const mockExisting = { id: 'f1' }
      const mockCheckChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValue({ data: mockExisting, error: null }),
      }

      const mockDeleteChain = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      }

      ;(supabase.from as any)
        .mockReturnValueOnce(mockCheckChain)
        .mockReturnValueOnce(mockDeleteChain)

      const result = await favoritesApi.toggle('l1', 'u1')

      expect(result.data?.isFavorited).toBe(false)
      expect(supabase.from).toHaveBeenCalledWith('favorites')
    })

    it('adds to favorites if not exists', async () => {
      const mockCheckChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }

      const mockInsertChain = {
        insert: vi.fn().mockResolvedValue({ error: null }),
      }

      ;(supabase.from as any)
        .mockReturnValueOnce(mockCheckChain)
        .mockReturnValueOnce(mockInsertChain)

      const result = await favoritesApi.toggle('l2', 'u2')

      expect(result.data?.isFavorited).toBe(true)
    })
  })

  describe('isFavorited', () => {
    it('returns true if favorite exists', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi
          .fn()
          .mockResolvedValue({ data: { id: 'f1' }, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      const result = await favoritesApi.isFavorited('l1', 'u1')
      expect(result.data).toBe(true)
    })

    it('returns false if favorite missing', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }
      ;(supabase.from as any).mockReturnValue(mockChain)

      const result = await favoritesApi.isFavorited('l1', 'u1')
      expect(result.data).toBe(false)
    })
  })
})
