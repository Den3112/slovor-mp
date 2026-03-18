'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

export interface CompareItem {
  id: string
  title: string
  price: number
  image?: string
  category: string
  features: Record<string, any>
}

export function useCompare() {
  const [items, setItems] = useState<CompareItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('slovor_compare')
    if (saved) {
      setItems(JSON.parse(saved))
    }
  }, [])

  const saveToStorage = (newItems: CompareItem[]) => {
    localStorage.setItem('slovor_compare', JSON.stringify(newItems))
  }

  const addToCompare = useCallback((item: CompareItem) => {
    setItems((prev) => {
      if (prev.find((i) => i.id === item.id)) {
        toast.info('Produkt je už v porovnaní')
        return prev
      }

      if (prev.length >= 4) {
        toast.error('Môžete porovnávať maximálne 4 produkty')
        return prev
      }

      if (prev.length > 0 && prev[0]?.category !== item.category) {
        toast.warning('Porovnávate produkty z rôznych kategórií')
      }

      const newItems = [...prev, item]
      saveToStorage(newItems)
      return newItems
    })
  }, [])

  const removeFromCompare = useCallback((id: string) => {
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id)
      saveToStorage(newItems)
      return newItems
    })
  }, [])

  const clearCompare = useCallback(() => {
    setItems([])
    localStorage.removeItem('slovor_compare')
  }, [])

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
