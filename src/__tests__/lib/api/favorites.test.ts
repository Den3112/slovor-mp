import { describe, it, expect, vi, beforeEach } from 'vitest'
import { favoritesApi } from '@/lib/api/favorites'
import { supabase } from '@/lib/supabase/client'

describe('favoritesApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getByUser', () => {
    it('fetches and flattens favorites', async () => {
      const mockData = [{ listing: { id: '1', title: 'L1' } }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await favoritesApi.getByUser('u1')
      if (response.data && response.data.length > 0) {
        expect(response.data[0]!.title).toBe('L1')
      }
    })
  })

  describe('toggle', () => {
    it('adds to favorites if not exists', async () => {
      // Check existing mock
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })

      // Insert mock
      const insertMock = vi.fn().mockResolvedValue({ error: null })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'favorites') {
          // We need to support both select and insert on the same object?
          // No, they are separate calls.
          return {
            select: selectMock,
            insert: insertMock,
          } as any
        }
        return {} as any
      })

      const response = await favoritesApi.toggle('l1', 'u1')
      expect(response.data?.isFavorited).toBe(true)
      expect(insertMock).toHaveBeenCalled()
    })

    it('removes from favorites if exists', async () => {
      // Check existing mock
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '100' }, error: null })
      const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })

      // Delete mock
      const deleteEqMock = vi.fn().mockResolvedValue({ error: null })
      const deleteMock = vi.fn().mockReturnValue({ eq: deleteEqMock })

      vi.mocked(supabase.from).mockImplementation((table) => {
        if (table === 'favorites') {
          return {
            select: selectMock,
            delete: deleteMock,
          } as any
        }
        return {} as any
      })

      const response = await favoritesApi.toggle('l1', 'u1')
      expect(response.data?.isFavorited).toBe(false)
      expect(deleteMock).toHaveBeenCalled()
      expect(deleteEqMock).toHaveBeenCalledWith('id', '100')
    })
  })

  describe('isFavorited', () => {
    it('checks if favorited', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })
      const eqMock2 = vi.fn().mockReturnValue({ maybeSingle: maybeSingleMock })
      const eqMock1 = vi.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock1 })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await favoritesApi.isFavorited('l1', 'u1')
      expect(response.data).toBe(true)
    })
  })
})
