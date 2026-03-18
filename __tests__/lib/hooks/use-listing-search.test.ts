import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useListingSearch } from '@/lib/hooks/use-listing-search'
import { searchListings } from '@/lib/actions/search-listings'

vi.mock('@/lib/actions/search-listings', () => ({
  searchListings: vi.fn(),
}))

describe('useListingSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => useListingSearch())

    expect(result.current.query).toBe('')
    expect(result.current.results).toEqual([])
    expect(result.current.isSearching).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('updates query immediately but debounces search', async () => {
    const { result } = renderHook(() => useListingSearch())

    act(() => {
      result.current.setQuery('test')
    })

    expect(result.current.query).toBe('test')
    // Search shouldn't have started yet
    expect(searchListings).not.toHaveBeenCalled()

    // Fast-forward time
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(searchListings).toHaveBeenCalledWith('test')
  })

  it('does not search if query length is less than 2', async () => {
    const { result } = renderHook(() => useListingSearch())

    act(() => {
      result.current.setQuery('a')
    })

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(searchListings).not.toHaveBeenCalled()
    expect(result.current.results).toEqual([])
  })

  it('handles successful search results', async () => {
    const mockData = [{ id: '1', title: 'Test Item' }]
    vi.mocked(searchListings).mockResolvedValue({
      data: mockData as any,
      error: null,
    })

    const { result } = renderHook(() => useListingSearch())

    act(() => {
      result.current.setQuery('items')
    })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.results).toEqual(mockData)
    expect(result.current.isSearching).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('handles search errors', async () => {
    vi.mocked(searchListings).mockResolvedValue({
      data: null,
      error: 'Search Failed',
    })

    const { result } = renderHook(() => useListingSearch())

    act(() => {
      result.current.setQuery('error-case')
    })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.error).toBe('Search Failed')
    expect(result.current.results).toEqual([])
  })

  it('handles unexpected catch block errors', async () => {
    vi.mocked(searchListings).mockRejectedValue(new Error('Crash'))

    const { result } = renderHook(() => useListingSearch())

    act(() => {
      result.current.setQuery('crash-case')
    })

    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(result.current.error).toBe('An unexpected error occurred')
  })
})
