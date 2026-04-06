'use client'

import { useSyncExternalStore, useCallback } from 'react'
import { toast } from 'sonner'

const STORAGE_KEY = 'slovor_compare'

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback)
  window.addEventListener('compare-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('compare-updated', callback)
  }
}

const getSnapshot = () => {
  if (typeof window === 'undefined') return '[]'
  return localStorage.getItem(STORAGE_KEY) || '[]'
}

const getServerSnapshot = () => '[]'

export interface CompareItem {
  id: string
  title: string
  price: number
  image?: string
  category: string
  features: Record<string, any>
}

export function useCompare() {
  const itemsRaw = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  )
  const items = JSON.parse(itemsRaw) as CompareItem[]

  const saveToStorage = useCallback((newItems: CompareItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems))
    window.dispatchEvent(new Event('compare-updated'))
  }, [])

  const addToCompare = useCallback(
    (item: CompareItem) => {
      const currentItems = JSON.parse(getSnapshot()) as CompareItem[]
      if (currentItems.find((i) => i.id === item.id)) {
        toast.info('Produkt je už v porovnaní')
        return
      }

      if (currentItems.length >= 4) {
        toast.error('Môžete porovnávať maximálne 4 produkty')
        return
      }

      if (
        currentItems.length > 0 &&
        currentItems[0]?.category !== item.category
      ) {
        toast.warning('Porovnávate produkty z rôznych kategórií')
      }

      const newItems = [...currentItems, item]
      saveToStorage(newItems)
    },
    [saveToStorage]
  )

  const removeFromCompare = useCallback(
    (id: string) => {
      const currentItems = JSON.parse(getSnapshot()) as CompareItem[]
      const newItems = currentItems.filter((i) => i.id !== id)
      saveToStorage(newItems)
    },
    [saveToStorage]
  )

  const clearCompare = useCallback(() => {
    saveToStorage([])
  }, [saveToStorage])

  return {
    items,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare: useCallback(
      (id: string) => items.some((i) => i.id === id),
      [items]
    ),
  }
}
