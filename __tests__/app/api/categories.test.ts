import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/categories/route'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(),
}))

describe('API Categories Route', () => {
  let mockSupabase: any
  let mockFrom: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockFrom = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      then: (cb: any) => cb({ data: [], error: null }),
    }

    mockSupabase = {
      from: vi.fn(() => mockFrom),
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase)
  })

  it('returns categories sorted by order_index', async () => {
    const mockData = [{ id: '1', name: 'Cat' }]
    mockFrom.then = (cb: any) => cb({ data: mockData, error: null })

    const req = new NextRequest('http://localhost/api/categories')
    const res = await GET(req)
    const json = await res.json()

    expect(res.status).toBe(200)
    expect(json).toEqual(mockData)
    expect(mockFrom.select).toHaveBeenCalledWith('*')
    expect(mockFrom.order).toHaveBeenCalledWith('order_index', {
      ascending: true,
    })
  })

  it('handles db error', async () => {
    mockFrom.then = (cb: any) => cb({ data: null, error: { message: 'Fail' } })

    const req = new NextRequest('http://localhost/api/categories')
    const res = await GET(req)

    expect(res.status).toBe(500)
  })
})
