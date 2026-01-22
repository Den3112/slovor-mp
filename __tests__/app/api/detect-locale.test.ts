import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/detect-locale/route'
import { headers } from 'next/headers'

// Mock next/headers
vi.mock('next/headers', () => ({
    headers: vi.fn(),
}))

describe('API Detect Locale Route', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('detects locale from IP country (SK)', async () => {
        const headersMock = new Map([
            ['x-vercel-ip-country', 'SK']
        ])
        vi.mocked(headers).mockResolvedValue(headersMock as any)

        const response = await GET()
        const data = await response.json()

        expect(data.locale).toBe('sk')
        expect(data.country).toBe('SK')
        expect(data.source).toBe('ip')
    })

    it('detects locale from IP country (CZ)', async () => {
        const headersMock = new Map([
            ['cf-ipcountry', 'CZ']
        ])
        vi.mocked(headers).mockResolvedValue(headersMock as any)

        const response = await GET()
        const data = await response.json()

        expect(data.locale).toBe('cs')
        expect(data.country).toBe('CZ')
    })

    it('falls back to Accept-Language', async () => {
        const headersMock = new Map([
            ['accept-language', 'sk-SK,sk;q=0.9,en;q=0.8']
        ])
        vi.mocked(headers).mockResolvedValue(headersMock as any)

        const response = await GET()
        const data = await response.json()

        expect(data.locale).toBe('sk')
        expect(data.source).toBe('browser')
    })

    it('defaults to English for unknown country/lang', async () => {
        const headersMock = new Map()
        vi.mocked(headers).mockResolvedValue(headersMock as any)

        const response = await GET()
        const data = await response.json()

        expect(data.locale).toBe('en')
        expect(data.source).toBe('default')
    })
})
