import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/detect-locale/route'

// Mock headers
vi.mock('next/headers', () => ({
  headers: vi.fn(),
}))

describe('API: Detect Locale', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('GET /api/detect-locale', () => {
    it('should detect locale from Vercel geo headers (Slovakia)', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn((key) => {
          if (key === 'x-vercel-ip-country') return 'SK'
          return null
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        locale: 'sk',
        country: 'SK',
        source: 'ip',
      })
    })

    it('should detect locale from Vercel geo headers (Czech Republic)', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn((key) => {
          if (key === 'x-vercel-ip-country') return 'CZ'
          return null
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        locale: 'cs',
        country: 'CZ',
        source: 'ip',
      })
    })

    it('should detect locale from Cloudflare headers', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn((key) => {
          if (key === 'cf-ipcountry') return 'GB'
          return null
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        locale: 'en',
        country: 'GB',
        source: 'ip',
      })
    })

    it('should fallback to Accept-Language header', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn((key) => {
          if (key === 'accept-language') return 'sk-SK,sk;q=0.9,en;q=0.8'
          return null
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        locale: 'sk',
        country: null,
        source: 'browser',
      })
    })

    it('should default to English when no detection possible', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn(() => null),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        locale: 'en',
        country: null,
        source: 'default',
      })
    })

    it('should handle unsupported countries with fallback to browser language', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn((key) => {
          if (key === 'x-vercel-ip-country') return 'DE'
          if (key === 'accept-language') return 'cs-CZ,cs;q=0.9'
          return null
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        locale: 'cs',
        country: null,
        source: 'browser',
      })
    })

    it('should handle errors gracefully', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockImplementation(() => {
        throw new Error('Headers error')
      })

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({
        locale: 'en',
        error: 'Failed to detect locale',
      })
    })

    it('should prioritize Vercel headers over Cloudflare', async () => {
      const { headers } = await import('next/headers')
      vi.mocked(headers).mockReturnValue({
        get: vi.fn((key) => {
          if (key === 'x-vercel-ip-country') return 'US'
          if (key === 'cf-ipcountry') return 'SK'
          return null
        }),
      } as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.country).toBe('US')
      expect(data.source).toBe('ip')
    })
  })
})
