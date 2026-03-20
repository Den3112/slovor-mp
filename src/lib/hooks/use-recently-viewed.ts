'use client'

import { useState, useEffect } from 'react'
import type { Listing } from '@/lib/api'

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

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch (e) {
      console.error('Failed to parse recently viewed items', e)
    }
  }, [])

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

      setItems((prev) => {
        // Remove verified existing duplicates of this item
        const filtered = prev.filter((i) => i.id !== listing.id)
        // Add new item to front
        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        return updated
      })
    } catch (e) {
      console.error('Failed to save recently viewed item', e)
    }
  }

  return { items, addItem }
}
