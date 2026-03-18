import { describe, it, expect, vi, beforeEach } from 'vitest'
import { categoriesApi } from '@/lib/api/categories'
import { supabase } from '@/lib/supabase/client'

describe('categoriesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.SKIP_ENV_VALIDATION = '0'
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
          listings: [{ count: 10 }],
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
        expect(response.data[1]!.listing_count).toBe(10)
      }
    })

    it('returns empty array if SKIP_ENV_VALIDATION is 1', async () => {
      process.env.SKIP_ENV_VALIDATION = '1'
      const response = await categoriesApi.getAll()
      expect(response.data).toEqual([])
      expect(response.error).toBeNull()
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

    it('returns build skip if SKIP_ENV_VALIDATION is 1', async () => {
      process.env.SKIP_ENV_VALIDATION = '1'
      const response = await categoriesApi.getBySlug('test')
      expect(response.error).toBe('Build skip')
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

  describe('write operations', () => {
    it('creates a category', async () => {
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })
      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await categoriesApi.create({
        name: 'New',
        slug: 'new',
      } as any)
      expect(response.data?.id).toBe('1')
    })

    it('updates a category', async () => {
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1', name: 'Updated' }, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await categoriesApi.update('1', { name: 'Updated' })
      expect(response.data?.name).toBe('Updated')
    })

    it('deletes a category', async () => {
      const eqMock = vi.fn().mockResolvedValue({ error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as any)

      const response = await categoriesApi.delete('1')
      expect(response.error).toBeNull()
    })

    it('handles errors in write operations', async () => {
      const insertMock = vi.fn().mockImplementation(() => {
        throw new Error('Write Error')
      })
      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await categoriesApi.create({ name: 'Fail' } as any)
      expect(response.error).toBe('Write Error')
    })

    it('handles exception in update', async () => {
      vi.mocked(supabase.from).mockImplementationOnce(() => {
        throw new Error('Update Crash')
      })
      const res = await categoriesApi.update('1', { name: 'New' })
      expect(res.error).toBe('Update Crash')
    })

    it('handles exception in delete', async () => {
      vi.mocked(supabase.from).mockImplementationOnce(() => {
        throw new Error('Delete Crash')
      })
      const res = await categoriesApi.delete('1')
      expect(res.error).toBe('Delete Crash')
    })
  })
})
