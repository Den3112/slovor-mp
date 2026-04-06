import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCompare, CompareItem } from '../use-compare'
import { toast } from 'sonner'

vi.mock('sonner', () => ({
  toast: {
    info: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    success: vi.fn(),
  },
}))

describe('useCompare', () => {
  const STORAGE_KEY = 'slovor_compare'

  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes with an empty list', () => {
    const { result } = renderHook(() => useCompare())
    expect(result.current.items).toEqual([])
  })

  it('adds an item to compare', () => {
    const { result } = renderHook(() => useCompare())
    const item: CompareItem = {
      id: '1',
      title: 'Car',
      price: 1000,
      category: 'auto',
      features: {},
    }

    act(() => {
      result.current.addToCompare(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0]!.id).toBe('1')
    expect(localStorage.getItem(STORAGE_KEY)).toContain('Car')
  })

  it('removes an item from compare', () => {
    const item: CompareItem = {
      id: '1',
      title: 'Car',
      price: 1000,
      category: 'auto',
      features: {},
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item]))

    const { result } = renderHook(() => useCompare())
    act(() => {
      result.current.removeFromCompare('1')
    })

    expect(result.current.items).toHaveLength(0)
    expect(localStorage.getItem(STORAGE_KEY)).toBe('[]')
  })

  it('clears all items', () => {
    const item: CompareItem = {
      id: '1',
      title: 'Car',
      price: 1000,
      category: 'auto',
      features: {},
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item]))

    const { result } = renderHook(() => useCompare())
    act(() => {
      result.current.clearCompare()
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('prevents adding duplicates', () => {
    const item: CompareItem = {
      id: '1',
      title: 'Car',
      price: 1000,
      category: 'auto',
      features: {},
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item]))

    const { result } = renderHook(() => useCompare())
    act(() => {
      result.current.addToCompare(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(toast.info).toHaveBeenCalledWith('Produkt je už v porovnaní')
  })

  it('limits comparison to 4 items', () => {
    const items: CompareItem[] = [
      { id: '1', title: 'A', price: 1, category: 'auto', features: {} },
      { id: '2', title: 'B', price: 2, category: 'auto', features: {} },
      { id: '3', title: 'C', price: 3, category: 'auto', features: {} },
      { id: '4', title: 'D', price: 4, category: 'auto', features: {} },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))

    const { result } = renderHook(() => useCompare())
    const newItem: CompareItem = {
      id: '5',
      title: 'E',
      price: 5,
      category: 'auto',
      features: {},
    }

    act(() => {
      result.current.addToCompare(newItem)
    })

    expect(result.current.items).toHaveLength(4)
    expect(toast.error).toHaveBeenCalledWith(
      'Môžete porovnávať maximálne 4 produkty'
    )
  })

  it('warns when adding items from different categories', () => {
    const itemA: CompareItem = {
      id: '1',
      title: 'Car',
      price: 1000,
      category: 'auto',
      features: {},
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([itemA]))

    const { result } = renderHook(() => useCompare())
    const itemB: CompareItem = {
      id: '2',
      title: 'Phone',
      price: 500,
      category: 'tech',
      features: {},
    }

    act(() => {
      result.current.addToCompare(itemB)
    })

    expect(result.current.items).toHaveLength(2)
    expect(toast.warning).toHaveBeenCalledWith(
      'Porovnávate produkty z rôznych kategórií'
    )
  })

  it('checks if an item is in compare', () => {
    const item: CompareItem = {
      id: '1',
      title: 'Car',
      price: 1000,
      category: 'auto',
      features: {},
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify([item]))

    const { result } = renderHook(() => useCompare())
    expect(result.current.isInCompare('1')).toBe(true)
    expect(result.current.isInCompare('2')).toBe(false)
  })
})
