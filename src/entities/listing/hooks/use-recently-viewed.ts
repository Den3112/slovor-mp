'use client'

import { useSyncExternalStore } from 'react'
import type { Listing } from '@/entities/listing/api'

const MAX_ITEMS = 10
const STORAGE_KEY = 'slovor_recently_viewed'

export interface RecentItem {
  id: string
  title: string
  price: number
  currency: string
  image?: string
  slug?: string
  viewedAt: string
}

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener('recently-viewed-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('recently-viewed-updated', callback)
  }
}

const getSnapshot = () => {
  if (typeof window === 'undefined') return '[]'
  return localStorage.getItem(STORAGE_KEY) || '[]'
}

const getServerSnapshot = () => '[]'

export function useRecentlyViewed() {
  const itemsRaw = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const items = JSON.parse(itemsRaw) as RecentItem[]

  const addItem = (listing: Listing) => {
    try {
      const newItem: RecentItem = {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        currency: listing.currency,
        image: listing.images?.[0],
        viewedAt: new Date().toISOString(),
      }

      // Remove verified existing duplicates of this item
      const filtered = items.filter((i) => i.id !== listing.id)
      // Add new item to front
      const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new Event('recently-viewed-updated'))
    } catch (e) {
      console.error('Failed to save recently viewed item', e)
    }
  }

  return { items, addItem }
}
