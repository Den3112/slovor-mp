import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'slovor-offline-db'
const DB_VERSION = 1

export interface OfflineCache {
  listings: any[]
  favorites: any[]
  lastUpdated: number
}

/**
 * Initialize IndexedDB for offline storage.
 */
export async function initOfflineDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('listings')) {
        db.createObjectStore('listings', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta')
      }
    },
  })
}

/**
 * Cache search results for offline browsing.
 */
export async function cacheListings(listings: any[]) {
  const db = await initOfflineDB()
  const tx = db.transaction('listings', 'readwrite')
  const store = tx.objectStore('listings')

  // Clear old cache (simple strategy for MVP)
  await store.clear()

  for (const listing of listings) {
    await store.put(listing)
  }

  await db.put('meta', Date.now(), 'listings_last_updated')
  await tx.done
}

/**
 * Get cached listings from IndexedDB.
 */
export async function getCachedListings(): Promise<any[]> {
  try {
    const db = await initOfflineDB()
    return await db.getAll('listings')
  } catch (error) {
    console.error('Failed to fetch from offline cache:', error)
    return []
  }
}

/**
 * Cache favorite listings for offline access.
 */
export async function cacheFavorites(favorites: any[]) {
  const db = await initOfflineDB()
  const tx = db.transaction('favorites', 'readwrite')
  const store = tx.objectStore('favorites')

  await store.clear()
  for (const fav of favorites) {
    await store.put(fav)
  }

  await db.put('meta', Date.now(), 'favorites_last_updated')
  await tx.done
}

/**
 * Get cached favorites.
 */
export async function getCachedFavorites(): Promise<any[]> {
  try {
    const db = await initOfflineDB()
    return await db.getAll('favorites')
  } catch (error) {
    console.error('Failed to fetch favorites from cache:', error)
    return []
  }
}
