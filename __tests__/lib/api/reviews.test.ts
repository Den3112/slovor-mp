import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reviewsApi } from '@/lib/api/reviews'
import { supabase } from '@/lib/supabase/client'

describe('reviewsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    it('creates review successfully', async () => {
      const input = {
        recipient_id: 's1',
        author_id: 'b1',
        rating: 5,
        comment: 'Great',
      }
      const mockReview = { id: '1', ...input }

      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: mockReview, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const insertMock = vi.fn().mockReturnValue({ select: selectMock })

      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await reviewsApi.create(input)
      expect(response.error).toBeNull()
      expect(response.data).toEqual(mockReview)
    })

    it('prevents self-review', async () => {
      const response = await reviewsApi.create({
        recipient_id: 'u1',
        author_id: 'u1',
        rating: 5,
      })
      expect(response.error).toContain('cannot review yourself')
    })

    it('validates rating range', async () => {
      const response = await reviewsApi.create({
        recipient_id: 's1',
        author_id: 'b1',
        rating: 6,
      })
      expect(response.error).toContain('between 1 and 5')
    })
  })

  describe('getForSeller', () => {
    it('calculates average rating', async () => {
      const mockReviews = [{ rating: 5 }, { rating: 3 }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockReviews, error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      // Because of the double order in original code, we might need to handle chain differently if strict,
      // but mockReturnThis typically handles repeated calls fine if they all return the same 'this'
      // However, the code has .order().order().
      // In my setup, .order() returns 'this'.

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reviewsApi.getForSeller('s1')

      expect(response.data?.totalReviews).toBe(2)
      expect(response.data?.averageRating).toBe(4) // (5+3)/2
    })

    it('handles zero reviews', async () => {
      const orderMock = vi.fn().mockResolvedValue({ data: [], error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reviewsApi.getForSeller('s1')
      expect(response.data?.averageRating).toBe(0)
      expect(response.data?.totalReviews).toBe(0)
    })

    it('handles database errors', async () => {
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Fetch Error' } })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reviewsApi.getForSeller('s1')
      expect(response.error).toBe('Fetch Error')
    })
  })

  describe('hasReviewed', () => {
    it('checks if reviewed (with listing)', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })

      const chain = {
        eq: vi.fn(),
        maybeSingle: maybeSingleMock,
      }
      chain.eq.mockReturnValue(chain)

      const selectMock = vi.fn().mockReturnValue(chain)

      vi.mocked(supabase.from).mockReturnValue({
        select: selectMock,
      } as any)

      const response = await reviewsApi.hasReviewed('s1', 'b1', 'l1')
      expect(response.data).toBe(true)
    })

    it('checks if reviewed (without listing)', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: null })
      const chain = {
        eq: vi.fn(),
        maybeSingle: maybeSingleMock,
      }
      chain.eq.mockReturnValue(chain)
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue(chain),
      } as any)

      const response = await reviewsApi.hasReviewed('s1', 'b1')
      expect(response.data).toBe(false)
    })

    it('handles database errors', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Check Error' } })
      const chain = {
        eq: vi.fn(),
        maybeSingle: maybeSingleMock,
      }
      chain.eq.mockReturnValue(chain)
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue(chain),
      } as any)

      const response = await reviewsApi.hasReviewed('s1', 'b1')
      expect(response.error).toBe('Check Error')
    })
  })

  describe('delete', () => {
    it('deletes review', async () => {
      const thenable = {
        then: (resolve: any) => resolve({ error: null }),
        eq: vi.fn().mockReturnThis(),
      }
      thenable.eq.mockReturnValue(thenable as any)

      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue(thenable),
      } as any)

      const response = await reviewsApi.delete('r1', 'b1')
      expect(response.data).toBe(true)
    })

    it('handles database errors', async () => {
      const thenable = {
        then: (resolve: any) => resolve({ error: { message: 'Delete Error' } }),
        eq: vi.fn().mockReturnThis(),
      }
      thenable.eq.mockReturnValue(thenable as any)
      vi.mocked(supabase.from).mockReturnValue({
        delete: vi.fn().mockReturnValue(thenable),
      } as any)

      const response = await reviewsApi.delete('r1', 'b1')
      expect(response.error).toBe('Delete Error')
    })
  })

  describe('getByAuthor', () => {
    it('fetches author reviews', async () => {
      const mockData = [{ id: '1' }]
      const orderMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reviewsApi.getByAuthor('b1')
      expect(response.data).toHaveLength(1)
    })

    it('handles database errors', async () => {
      const orderMock = vi
        .fn()
        .mockResolvedValue({
          data: null,
          error: { message: 'Author Reviews Error' },
        })
      const eqMock = vi.fn().mockReturnValue({ order: orderMock })
      const selectMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ select: selectMock } as any)

      const response = await reviewsApi.getByAuthor('b1')
      expect(response.error).toBe('Author Reviews Error')
    })
  })

  describe('reply', () => {
    it('updates review with seller reply', async () => {
      const mockReview = { id: 'r1', seller_reply: 'Thanks' }
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: mockReview, error: null })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })

      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await reviewsApi.reply('r1', 'Thanks')
      expect(response.data?.seller_reply).toBe('Thanks')
    })

    it('handles database errors', async () => {
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: { message: 'Reply Error' } })
      const selectMock = vi.fn().mockReturnValue({ single: singleMock })
      const eqMock = vi.fn().mockReturnValue({ select: selectMock })
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock })
      vi.mocked(supabase.from).mockReturnValue({ update: updateMock } as any)

      const response = await reviewsApi.reply('r1', 'Thanks')
      expect(response.error).toBe('Reply Error')
    })
  })

  describe('error handling', () => {
    it('catches database errors in create', async () => {
      const insertMock = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
        }),
      })
      vi.mocked(supabase.from).mockReturnValue({ insert: insertMock } as any)

      const response = await reviewsApi.create({
        recipient_id: 's',
        author_id: 'a',
        rating: 5,
      })
      expect(response.error).toBe('DB Error')
    })
  })
})
