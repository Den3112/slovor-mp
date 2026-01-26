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
  })

  describe('hasReviewed', () => {
    it('checks if reviewed (with listing)', async () => {
      const maybeSingleMock = vi
        .fn()
        .mockResolvedValue({ data: { id: '1' }, error: null })
      // query chain: select -> eq -> eq -> [eq] -> maybeSingle
      const eqMock = vi
        .fn()
        .mockReturnValue({
          maybeSingle: maybeSingleMock,
          eq: vi.fn(),
          select: vi.fn(),
        })
      // Setting up circular "this" for eq
      eqMock.mockReturnValue(eqMock)
      // Actually, my global setup does mockReturnThis for eq.
      // But here I need `maybeSingle` to be available on the result of `eq`.
      // In global setup: `eq: vi.fn().mockReturnThis()`.
      // And `maybeSingle` is on the MAIN object.
      // So recursively it works.

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: maybeSingleMock,
      } as any)

      const response = await reviewsApi.hasReviewed('s1', 'b1', 'l1')
      expect(response.data).toBe(true)
    })
  })

  describe('delete', () => {
    it('deletes review', async () => {
      vi.fn().mockResolvedValue({ error: null })
      // In setup: delete() returns this. Then eq(). Then eq().
      // Wait, supabase delete() is usually at the start/middle... `supabase.from().delete().eq().eq()`
      // `delete` returns a builder.
      // But `delete()` can also Execute? No, usually it's `delete()`.
      // The code is: `.delete().eq().eq()` and then await.
      // So the LAST `eq` needs to be thenable/resolve.
      // In my setup `eq` returns `this`.
      // So `this` needs to be thenable?
      // The global setup `eq: vi.fn().mockReturnThis()` means it returns the API object.

      // I need to override `eq` to be thenable for the *last* call.
      // Or use `mockResolvedValue` on the object itself if Vitest supports it? No.
      // The standard Supabase client is thenable on the builder.
      // My mock object in `vitest.setup.tsx` is NOT thenable by default unless I add `then`.

      // Wait, for `create` (insert), I mocked `insert().select().single()`. `single` returns promise.
      // Here `delete().eq().eq()`.
      // I need to make the object looks like a promise.

      const thenable = {
        then: (resolve: any) => resolve({ error: null }),
        eq: vi.fn().mockReturnThis(), // Allow chaining
      }

      const deleteMock = vi.fn().mockReturnValue(thenable)
      // But wait, `eq` is called on the result of `delete`, returning `this` (thenable).
      // Then `eq` called again.
      // So `thenable.eq` needs to return `thenable`.
      thenable.eq.mockReturnValue(thenable as any)

      vi.mocked(supabase.from).mockReturnValue({ delete: deleteMock } as any)

      const response = await reviewsApi.delete('r1', 'b1')
      expect(response.error).toBeNull()
      expect(response.data).toBe(true)
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
  })
})
