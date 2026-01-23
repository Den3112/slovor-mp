import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  trackEvent,
  getTrackedEvents,
  clearTrackedEvents,
} from '@/lib/utils/analytics'

describe('analytics utility', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

  beforeEach(() => {
    sessionStorage.clear()
    consoleSpy.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('logs events to console in non-production environment', () => {
    trackEvent('listing_view', { listing_id: '123' })
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[Analytics] listing_view'),
      expect.stringContaining('{"listing_id":"123"}')
    )
  })

  it('stores events in sessionStorage in non-production environment', () => {
    trackEvent('search_performed', { query: 'test' })
    const events = getTrackedEvents()
    expect(events).toHaveLength(1)
    expect(events[0]?.name).toBe('search_performed')
    expect(events[0]?.payload).toEqual({ query: 'test' })
  })

  it('limits stored events to 50', () => {
    for (let i = 0; i < 60; i++) {
      trackEvent('filter_applied', { i })
    }
    const events = getTrackedEvents()
    expect(events).toHaveLength(50)
    expect(events[49]?.payload).toEqual({ i: 59 })
    expect(events[0]?.payload).toEqual({ i: 10 })
  })

  it('clears tracked events', () => {
    trackEvent('message_sent')
    expect(getTrackedEvents()).toHaveLength(1)
    clearTrackedEvents()
    expect(getTrackedEvents()).toHaveLength(0)
  })

  it('handles storage errors gracefully', () => {
    const setItemSpy = vi
      .spyOn(sessionStorage, 'setItem')
      .mockImplementation(() => {
        throw new Error('Storage full')
      })

    // Should not throw
    trackEvent('report_submitted')
    expect(getTrackedEvents()).toHaveLength(0)

    setItemSpy.mockRestore()
  })
})
