import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  saveListingDraft,
  loadListingDraft,
  clearListingDraft,
} from '@/shared/lib/utils/draft-storage'

describe('draft-storage utility', () => {
  const mockUser = 'user-123'
  const mockData = { title: 'Draft Title' } as any

  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('saves draft to localStorage', () => {
    saveListingDraft(mockUser, mockData)
    const key = `listing-draft:${mockUser}`
    const stored = JSON.parse(localStorage.getItem(key)!)
    expect(stored.data).toEqual(mockData)
    expect(stored.timestamp).toBeDefined()
  })

  it('loads draft from localStorage', () => {
    saveListingDraft(mockUser, mockData)
    const loaded = loadListingDraft(mockUser)
    expect(loaded).toEqual(mockData)
  })

  it('returns null if draft is expired', () => {
    const oldTimestamp = Date.now() - 8 * 24 * 60 * 60 * 1000 // 8 days
    const key = `listing-draft:${mockUser}`
    localStorage.setItem(
      key,
      JSON.stringify({ data: mockData, timestamp: oldTimestamp })
    )

    const loaded = loadListingDraft(mockUser)
    expect(loaded).toBeNull()
    expect(localStorage.getItem(key)).toBeNull()
  })

  it('clears draft', () => {
    saveListingDraft(mockUser, mockData)
    clearListingDraft(mockUser)
    expect(loadListingDraft(mockUser)).toBeNull()
  })

  it('handles null userId gracefully', () => {
    saveListingDraft(null, mockData)
    expect(localStorage.length).toBe(0)
    expect(loadListingDraft(null)).toBeNull()
  })

  it('handles storage errors', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Completely mock localStorage for this test
    const originalLocalStorage = window.localStorage
    const mockStorage = {
      setItem: vi.fn(() => {
        throw new Error('Full')
      }),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      configurable: true,
    })

    saveListingDraft(mockUser, mockData)
    expect(errorSpy).toHaveBeenCalled()

    // Restore original localStorage
    Object.defineProperty(window, 'localStorage', {
      value: originalLocalStorage,
      configurable: true,
    })
    errorSpy.mockRestore()
  })
})
