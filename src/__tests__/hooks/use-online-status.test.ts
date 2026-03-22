import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useOnlineStatus } from '@/hooks/use-online-status'

describe('useOnlineStatus', () => {
  const originalOnLine = window.navigator.onLine

  beforeEach(() => {
    vi.stubGlobal('navigator', { onLine: true })
  })

  afterEach(() => {
    vi.stubGlobal('navigator', { onLine: originalOnLine })
    vi.restoreAllMocks()
  })

  it('should return initial online state', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
  })

  it('should update state when going offline', () => {
    const { result } = renderHook(() => useOnlineStatus())
    
    act(() => {
      // Mock navigator.onLine to be false
      vi.stubGlobal('navigator', { onLine: false })
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current).toBe(false)
  })

  it('should update state when coming back online', () => {
    vi.stubGlobal('navigator', { onLine: false })
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(false)
    
    act(() => {
      vi.stubGlobal('navigator', { onLine: true })
      window.dispatchEvent(new Event('online'))
    })

    expect(result.current).toBe(true)
  })
})
