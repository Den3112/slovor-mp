import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  cacheListings,
  getCachedListings,
  cacheFavorites,
  getCachedFavorites,
} from '../offline-cache'

const { vi_mockDb, vi_mockStore } = vi.hoisted(() => {
  const mockStore = {
    clear: vi.fn(),
    put: vi.fn(),
    getAll: vi.fn(),
  }

  const mockTx = {
    objectStore: vi.fn().mockReturnValue(mockStore),
    done: Promise.resolve(),
  }

  const mockDb = {
    transaction: vi.fn().mockReturnValue(mockTx),
    put: vi.fn(),
    getAll: vi.fn(),
    objectStoreNames: {
      contains: vi.fn().mockReturnValue(true),
    },
  }

  return { vi_mockDb: mockDb, vi_mockStore: mockStore }
})

vi.mock('idb', () => ({
  openDB: vi.fn().mockResolvedValue(vi_mockDb),
}))

describe('Offline Cache Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('cacheListings', () => {
    it('clears and populates the listings store', async () => {
      const mockListings = [{ id: '1' }, { id: '2' }]
      await cacheListings(mockListings)

      expect(vi_mockStore.clear).toHaveBeenCalled()
      expect(vi_mockStore.put).toHaveBeenCalledTimes(2)
      expect(vi_mockDb.put).toHaveBeenCalledWith(
        'meta',
        expect.any(Number),
        'listings_last_updated'
      )
    })
  })

  describe('getCachedListings', () => {
    it('returns listings from the store', async () => {
      const mockListings = [{ id: '1' }]
      vi_mockDb.getAll.mockResolvedValueOnce(mockListings)

      const result = await getCachedListings()
      expect(result).toEqual(mockListings)
    })

    it('returns an empty array on error', async () => {
      vi_mockDb.getAll.mockRejectedValueOnce(new Error('DB Error'))
      const result = await getCachedListings()
      expect(result).toEqual([])
    })
  })

  describe('cacheFavorites', () => {
    it('clears and populates the favorites store', async () => {
      const mockFavs = [{ id: 'f1' }]
      await cacheFavorites(mockFavs)

      expect(vi_mockStore.clear).toHaveBeenCalled()
      expect(vi_mockStore.put).toHaveBeenCalledWith(mockFavs[0])
      expect(vi_mockDb.put).toHaveBeenCalledWith(
        'meta',
        expect.any(Number),
        'favorites_last_updated'
      )
    })
  })

  describe('getCachedFavorites', () => {
    it('returns favorites from the store', async () => {
      const mockFavs = [{ id: 'f1' }]
      vi_mockDb.getAll.mockResolvedValueOnce(mockFavs)

      const result = await getCachedFavorites()
      expect(result).toEqual(mockFavs)
    })

    it('returns empty array on error', async () => {
      vi_mockDb.getAll.mockRejectedValueOnce(new Error('fail'))
      const result = await getCachedFavorites()
      expect(result).toEqual([])
    })
  })
})
