import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET, POST, PATCH, DELETE, OPTIONS } from '@/app/api/categories/route'
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

    // Advanced mock builder for Supabase
    const createMockFrom = () => {
      const mock: any = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
      }
      // Handle the promise re-implementation
      mock.then = vi.fn((onfulfilled) => {
        return Promise.resolve(onfulfilled({ data: [], error: null }))
      })
      return mock
    }

    mockFrom = createMockFrom()
    mockSupabase = {
      from: vi.fn(() => mockFrom),
    }

    vi.mocked(createClient).mockReturnValue(mockSupabase)
  })

  describe('GET', () => {
    it('returns categories sorted by order_index', async () => {
      const mockData = [{ id: '1', name: 'Cat', order_index: 0 }]
      mockFrom.then.mockImplementation((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: mockData, error: null }))
      )

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

    it('handles categories db error', async () => {
      mockFrom.then.mockImplementation((onfulfilled: any) =>
        Promise.resolve(
          onfulfilled({ data: null, error: { message: 'Database Error' } })
        )
      )

      const req = new NextRequest('http://localhost/api/categories')
      const res = await GET(req)
      const json = await res.json()

      expect(res.status).toBe(500)
      expect(json.message).toBe('Database Error')
    })

    it('handles unexpected exceptions in GET', async () => {
      vi.mocked(createClient).mockImplementationOnce(() => {
        throw new Error('Crash')
      })

      const req = new NextRequest('http://localhost/api/categories')
      const res = await GET(req)
      const json = await res.json()

      expect(res.status).toBe(500)
      expect(json.message).toBe('Crash')
    })
  })

  describe('POST', () => {
    it('creates a new category', async () => {
      const newCat = { name: 'New Cat', slug: 'new-cat' }
      mockFrom.then.mockImplementation((onfulfilled: any) =>
        Promise.resolve(
          onfulfilled({ data: { id: '123', ...newCat }, error: null })
        )
      )

      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify(newCat),
      })
      const res = await POST(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.id).toBe('123')
      expect(mockFrom.insert).toHaveBeenCalledWith(newCat)
    })

    it('returns 400 on insertion error', async () => {
      mockFrom.then.mockImplementation((onfulfilled: any) =>
        Promise.resolve(
          onfulfilled({
            data: null,
            error: { message: 'Unique constraint failed' },
          })
        )
      )

      const req = new NextRequest('http://localhost/api/categories', {
        method: 'POST',
        body: JSON.stringify({ name: 'Dup' }),
      })
      const res = await POST(req)
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.message).toBe('Unique constraint failed')
    })
  })

  describe('PATCH', () => {
    it('updates a category', async () => {
      const updates = { id: '123', name: 'Updated' }
      mockFrom.then.mockImplementation((onfulfilled: any) =>
        Promise.resolve(
          onfulfilled({ data: { id: '123', name: 'Updated' }, error: null })
        )
      )

      const req = new NextRequest('http://localhost/api/categories', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      })
      const res = await PATCH(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.name).toBe('Updated')
      expect(mockFrom.update).toHaveBeenCalledWith({ name: 'Updated' })
      expect(mockFrom.eq).toHaveBeenCalledWith('id', '123')
    })

    it('returns 400 if ID is missing in PATCH', async () => {
      const req = new NextRequest('http://localhost/api/categories', {
        method: 'PATCH',
        body: JSON.stringify({ name: 'No ID' }),
      })
      const res = await PATCH(req)
      const json = await res.json()

      expect(res.status).toBe(400)
      expect(json.message).toBe('Category ID is required')
    })
  })

  describe('DELETE', () => {
    it('deletes a category', async () => {
      mockFrom.then.mockImplementation((onfulfilled: any) =>
        Promise.resolve(onfulfilled({ data: null, error: null }))
      )

      const req = new NextRequest('http://localhost/api/categories?id=123', {
        method: 'DELETE',
      })
      const res = await DELETE(req)
      const json = await res.json()

      expect(res.status).toBe(200)
      expect(json.success).toBe(true)
      expect(mockFrom.delete).toHaveBeenCalled()
      expect(mockFrom.eq).toHaveBeenCalledWith('id', '123')
    })

    it('returns 400 if ID is missing in DELETE', async () => {
      const req = { url: 'http://localhost/api/categories' } as any
      const res = await DELETE(req)
      const data = await res.json()
      expect(res.status).toBe(400)
      expect(data.message).toBe('Category ID is required')
    })

    it('handles unexpected exceptions in DELETE', async () => {
      const req = { url: 'invalid-url' } as any // New URL(req.url) will throw
      const res = await DELETE(req)
      expect(res.status).toBe(500)
    })
  })

  describe('OPTIONS', () => {
    it('returns CORS headers', async () => {
      const res = await OPTIONS()
      expect(res.status).toBe(200)
      expect(res.headers.get('Access-Control-Allow-Origin')).toBe(
        'http://localhost:3000'
      )
      expect(res.headers.get('Access-Control-Allow-Headers')).toBe(
        'authorization, x-client-info, apikey, content-type'
      )
    })
  })

  describe('Extra Exception Coverage', () => {
    it('handles unexpected exceptions in POST', async () => {
      const req = {
        json: () => {
          throw new Error('JSON Error')
        },
      } as any
      const res = await POST(req)
      expect(res.status).toBe(500)
    })

    it('handles unexpected exceptions in PATCH', async () => {
      const req = {
        json: () => {
          throw new Error('JSON Error')
        },
      } as any
      const res = await PATCH(req)
      expect(res.status).toBe(500)
    })
  })
})
