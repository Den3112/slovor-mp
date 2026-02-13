import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoriesApi } from '@/lib/api/categories'
import { supabase } from '@/lib/supabase/client'

describe('categoriesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAll', () => {
    it('fetches all categories and adds listing counts', async () => {
      const mockCategories = [
        {
          id: '1',
          name: 'Electronics',
          slug: 'electronics',
          listings: [{ count: 5 }],
        },
        {
          id: '2',
          name: 'Fashion',
          slug: 'fashion',
          listings: [{ count: 5 }],
        },
      ]

      const selectMock = vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
      })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'categories') {
          return { select: selectMock } as any
        }
        return {} as any
      })

      const response = await categoriesApi.getAll()

      expect(response.error).toBeNull()
      expect(response.data).toHaveLength(2)
      if (response.data && response.data.length > 1) {
        expect(response.data[0]!.listing_count).toBe(5)
        expect(response.data[1]!.listing_count).toBe(5)
      }
    })

    it('handles errors when fetching categories', async () => {
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'DB Error' } })
      const selectMock = vi.fn().mockReturnValue({ order: orderMock })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'categories') return { select: selectMock } as any
        return {} as any
      })

      const response = await categoriesApi.getAll()
      expect(response.error).toBe('DB Error')
      expect(response.data).toBeNull()
    })
  })

  describe('getBySlug', () => {
    it('fetches category by slug and adds listing count', async () => {
      const mockCategory = { id: '1', name: 'Electronics', slug: 'electronics' }

      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: mockCategory, error: null })
      const limitMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock = vi.fn().mockReturnValue({ limit: limitMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      const countEqMock2 = vi.fn().mockResolvedValue({ count: 10 })
      const countEqMock1 = vi.fn().mockReturnValue({ eq: countEqMock2 })
      const countSelectMock = vi.fn().mockReturnValue({ eq: countEqMock1 })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'categories') return { select: selectMock } as any
        if (table === 'listings') return { select: countSelectMock } as any
        return {} as any
      })

      const response = await categoriesApi.getBySlug('electronics')

      expect(response.error).toBeNull()
      expect(response.data?.name).toBe('Electronics')
      expect(response.data?.listing_count).toBe(10)
    })

    it('handles errors when fetching category', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Not Found' } })
      const limitMock = vi
        .fn()
        .mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock = vi.fn().mockReturnValue({ limit: limitMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await categoriesApi.getBySlug('unknown')
      expect(response.error).toBe('Not Found')
    })
  })
})
