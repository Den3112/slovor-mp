import { describe, it, expect } from 'vitest'
import {
  applyListingFilters,
  applyListingSorting,
  applyListingPagination,
} from '@/entities/listing/api/filters'

describe('Listing Filters Logic', () => {
  const mockQuery = () => {
    const query: any = {
      eq: (col: string, val: any) => {
        query.calls.push({ type: 'eq', col, val })
        return query
      },
      gte: (col: string, val: any) => {
        query.calls.push({ type: 'gte', col, val })
        return query
      },
      lte: (col: string, val: any) => {
        query.calls.push({ type: 'lte', col, val })
        return query
      },
      ilike: (col: string, val: any) => {
        query.calls.push({ type: 'ilike', col, val })
        return query
      },
      or: (val: any) => {
        query.calls.push({ type: 'or', val })
        return query
      },
      order: (col: string, opts: any) => {
        query.calls.push({ type: 'order', col, opts })
        return query
      },
      limit: (val: any) => {
        query.calls.push({ type: 'limit', val })
        return query
      },
      range: (from: any, to: any) => {
        query.calls.push({ type: 'range', from, to })
        return query
      },
      calls: [] as any[],
    }
    return query
  }

  describe('applyListingFilters', () => {
    it('returns query as is if no options provided', () => {
      const query = mockQuery()
      const result = applyListingFilters(query)
      expect(result).toBe(query)
      expect(query.calls).toHaveLength(0)
    })

    it('filters by categoryId', () => {
      const query = mockQuery()
      applyListingFilters(query, { categoryId: '123' })
      expect(query.calls).toContainEqual({
        type: 'eq',
        col: 'category_id',
        val: '123',
      })
    })

    it('filters by categorySlug', () => {
      const query = mockQuery()
      applyListingFilters(query, { categorySlug: 'electronics' })
      expect(query.calls).toContainEqual({
        type: 'eq',
        col: 'category.slug',
        val: 'electronics',
      })
    })

    it('filters by search term', () => {
      const query = mockQuery()
      applyListingFilters(query, { search: ' iphone ' })
      expect(query.calls).toContainEqual(
        expect.objectContaining({
          type: 'or',
          val: expect.stringContaining('iphone'),
        })
      )
    })

    it('filters by price range', () => {
      const query = mockQuery()
      applyListingFilters(query, { priceMin: 100, priceMax: 500 })
      expect(query.calls).toContainEqual({
        type: 'gte',
        col: 'price',
        val: 100,
      })
      expect(query.calls).toContainEqual({
        type: 'lte',
        col: 'price',
        val: 500,
      })
    })

    it('filters by condition', () => {
      const query = mockQuery()
      applyListingFilters(query, { condition: 'new' })
      expect(query.calls).toContainEqual({
        type: 'eq',
        col: 'condition',
        val: 'new',
      })
    })

    it('filters by location', () => {
      const query = mockQuery()
      applyListingFilters(query, { location: 'Bratislava' })
      expect(query.calls).toContainEqual({
        type: 'ilike',
        col: 'location',
        val: '%Bratislava%',
      })
    })

    it('ignores location if "all"', () => {
      const query = mockQuery()
      applyListingFilters(query, { location: 'all' })
      expect(query.calls).toHaveLength(0)
    })

    it('filters featured listings', () => {
      const query = mockQuery()
      applyListingFilters(query, { isFeatured: true })
      expect(query.calls).toContainEqual({
        type: 'eq',
        col: 'is_highlighted',
        val: true,
      })
    })

    it('handles dynamic attributes', () => {
      const query = mockQuery()
      applyListingFilters(query, {
        attributes: {
          brand: 'Apple',
          year: { min: 2020, max: 2024 },
          invalid: '',
          ignored: null,
        },
      })
      expect(query.calls).toContainEqual({
        type: 'eq',
        col: 'attributes->>brand',
        val: 'Apple',
      })
      expect(query.calls).toContainEqual({
        type: 'gte',
        col: 'attributes->>year',
        val: 2020,
      })
      expect(query.calls).toContainEqual({
        type: 'lte',
        col: 'attributes->>year',
        val: 2024,
      })
      expect(query.calls.length).toBe(3)
    })

    it('handles min-only or max-only attribute ranges', () => {
      const query = mockQuery()
      applyListingFilters(query, {
        attributes: {
          price: { min: 100 },
          weight: { max: 50 },
        },
      })
      expect(query.calls).toContainEqual({
        type: 'gte',
        col: 'attributes->>price',
        val: 100,
      })
      expect(query.calls).toContainEqual({
        type: 'lte',
        col: 'attributes->>weight',
        val: 50,
      })
    })
  })

  describe('applyListingSorting', () => {
    it('sorts by oldest', () => {
      const query = mockQuery()
      applyListingSorting(query, 'oldest')
      expect(query.calls).toContainEqual({
        type: 'order',
        col: 'created_at',
        opts: { ascending: true },
      })
    })

    it('sorts by price-low', () => {
      const query = mockQuery()
      applyListingSorting(query, 'price-low')
      expect(query.calls).toContainEqual({
        type: 'order',
        col: 'price',
        opts: { ascending: true },
      })
    })

    it('sorts by price-high', () => {
      const query = mockQuery()
      applyListingSorting(query, 'price-high')
      expect(query.calls).toContainEqual({
        type: 'order',
        col: 'price',
        opts: { ascending: false },
      })
    })

    it('sorts by views', () => {
      const query = mockQuery()
      applyListingSorting(query, 'views')
      expect(query.calls).toContainEqual({
        type: 'order',
        col: 'views_count',
        opts: { ascending: false },
      })
    })

    it('defaults to newest', () => {
      const query = mockQuery()
      applyListingSorting(query, 'unknown')
      expect(query.calls).toContainEqual({
        type: 'order',
        col: 'created_at',
        opts: { ascending: false },
      })
    })
  })

  describe('applyListingPagination', () => {
    it('applies simple limit', () => {
      const query = mockQuery()
      applyListingPagination(query, { limit: 10 })
      expect(query.calls).toContainEqual({ type: 'limit', val: 10 })
    })

    it('applies offset and limit', () => {
      const query = mockQuery()
      applyListingPagination(query, { offset: 20, limit: 10 })
      expect(query.calls).toContainEqual({ type: 'range', from: 20, to: 29 })
    })

    it('applies page and limit', () => {
      const query = mockQuery()
      applyListingPagination(query, { page: 3, limit: 10 })
      expect(query.calls).toContainEqual({ type: 'range', from: 20, to: 29 })
    })

    it('returns query as is if no pagination provided', () => {
      const query = mockQuery()
      applyListingPagination(query)
      expect(query.calls).toHaveLength(0)
    })
  })
})
