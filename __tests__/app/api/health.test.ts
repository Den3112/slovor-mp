import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/health/route'

describe('API Health Route', () => {
    it('returns status healthy', async () => {
        const response = await GET()
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.status).toBe('healthy')
        expect(data.uptime).toBeDefined()
    })
})
