import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  trackEvent,
  getTrackedEvents,
  clearTrackedEvents,
} from '@/lib/utils/analytics'
import { track } from '@vercel/analytics'

vi.mock('@vercel/analytics', () => ({
  track: vi.fn(),
}))

describe('analytics utility', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('sessionStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    })
    vi.stubEnv('NODE_ENV', 'development')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  describe('trackEvent', () => {
    it('logs to console in development', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      trackEvent('listing_view', { listing_id: '123' })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Analytics] listing_view'),
        expect.stringContaining('123')
      )
      consoleSpy.mockRestore()
    })

    it('stores in sessionStorage in development client-side', () => {
      vi.stubGlobal('window', {})
      vi.mocked(sessionStorage.getItem).mockReturnValue('[]')

      trackEvent('search_performed', { query: 'test' })

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        '__analytics_events',
        expect.stringContaining('search_performed')
      )
    })

    it('limits sessionStorage to 50 events', () => {
      vi.stubGlobal('window', {})
      const manyEvents = Array(50).fill({ name: 'old' })
      vi.mocked(sessionStorage.getItem).mockReturnValue(
        JSON.stringify(manyEvents)
      )

      trackEvent('new_event')

      const setCall = vi.mocked(sessionStorage.setItem).mock.calls[0]
      const savedEvents = JSON.parse(setCall![1] as string)
      expect(savedEvents).toHaveLength(50)
      expect(savedEvents[49].name).toBe('new_event')
    })

    it('calls vercel analytics in production client-side', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubGlobal('window', {})

      trackEvent('listing_created', { listing_id: '456' })

      expect(track).toHaveBeenCalledWith('listing_created', {
        listing_id: '456',
      })
    })

    it('does not call vercel analytics in production server-side', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubGlobal('window', undefined)

      trackEvent('listing_created')
      expect(track).not.toHaveBeenCalled()
    })

    it('handles track errors gracefully in production', () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.stubGlobal('window', {})
      vi.mocked(track).mockImplementation(() => {
        throw new Error('Vercel Down')
      })
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      trackEvent('listing_view')

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to track event'),
        expect.any(Error)
      )
      errorSpy.mockRestore()
    })
  })

  describe('getTrackedEvents', () => {
    it('returns empty array if server-side', () => {
      vi.stubGlobal('window', undefined)
      expect(getTrackedEvents()).toEqual([])
    })

    it('returns parsed events from storage', () => {
      vi.stubGlobal('window', {})
      const mockEvents = [{ name: 'test', timestamp: 'now' }]
      vi.mocked(sessionStorage.getItem).mockReturnValue(
        JSON.stringify(mockEvents)
      )

      expect(getTrackedEvents()).toEqual(mockEvents)
    })

    it('returns empty array on parse error', () => {
      vi.stubGlobal('window', {})
      vi.mocked(sessionStorage.getItem).mockReturnValue('invalid-json')
      expect(getTrackedEvents()).toEqual([])
    })
  })

  describe('clearTrackedEvents', () => {
    it('removes item from sessionStorage', () => {
      vi.stubGlobal('window', {})
      clearTrackedEvents()
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(
        '__analytics_events'
      )
    })

    it('does nothing if server-side', () => {
      vi.stubGlobal('window', undefined)
      clearTrackedEvents()
      expect(sessionStorage.removeItem).not.toHaveBeenCalled()
    })
  })
})
