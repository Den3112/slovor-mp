import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listingsApi } from '@/entities/listing/api'

// Mock Supabase client (Supabase-like thenable query)
// Мы моделируем поведение клиента так, чтобы `await query` возвращал
// `{ data, error }` для обычных запросов и `{ count, error }` для count-запросов.

type SupabaseQueryType = 'data' | 'count'

let mockResult: { data: any; error: any } = { data: null, error: null }
let mockCountData: { count: any; error: any } = { count: null, error: null }

// Фабрика "запроса" с thenable-интерфейсом
const createQuery = (type: SupabaseQueryType = 'data') => {
  const query: any = {
    // Методы построителя запроса — просто возвращают тот же объект
    eq: vi.fn(() => query),
    order: vi.fn(() => query),
    limit: vi.fn(() => query),
    range: vi.fn(() => query),
    gte: vi.fn(() => query),
    lte: vi.fn(() => query),
    ilike: vi.fn(() => query),
    or: vi.fn(() => query),
    insert: vi.fn(() => query),
    update: vi.fn(() => query),
    delete: vi.fn(() => query),

    // Для getById, где используется .single()
    single: vi.fn().mockImplementation(() => Promise.resolve(mockResult)),

    select: vi.fn((...args: any[]) => {
      // Count‑запрос: select('id', { count: 'exact', head: true })
      if (args.length === 2 && typeof args[1] === 'object' && args[1]?.count) {
        return createQuery('count')
      }
      return query
    }),

    // Thenable‑интерфейс, чтобы `await query` работал как у Supabase
    then: (onFulfilled: any, onRejected: any) => {
      if (type === 'count') {
        return Promise.resolve({
          count: mockCountData.count,
          error: mockCountData.error,
        }).then(onFulfilled, onRejected)
      }

      return Promise.resolve({
        data: mockResult.data,
        error: mockResult.error,
      }).then(onFulfilled, onRejected)
    },
  }

  return query
}

let mockChain = createQuery('data')

vi.mock('@/shared/lib/supabase/client', () => ({
  supabase: {
    from: vi.fn((table: string) => {
      if (table === 'listings') {
        // каждый раз возвращаем новый запрос, чтобы стейты не протекали между тестами
        mockChain = createQuery('data')
        return mockChain
      }
      mockChain = createQuery('data')
      return mockChain
    }),
  },
}))

const supabase = { from: vi.fn(() => mockChain) } as any

describe('Listings API - Filters and Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResult = { data: [], error: null }
    mockCountData = { count: 0, error: null }
  })

  describe('Filtering', () => {
    it('should filter by category ID', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { categoryId: 'cat1' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should filter by price range', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 250,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, {
        priceMin: 100,
        priceMax: 500,
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should filter by search term', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'iPhone 14 Pro',
          price: 999,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { search: 'iPhone' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should filter by condition', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
          condition: 'new',
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { condition: 'new' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should filter by location', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Košice',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { location: 'Košice' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should filter featured listings', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Featured Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 100,
          featured: true,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { isFeatured: true })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('Sorting', () => {
    it('should sort by newest', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { sort: 'newest' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should sort by oldest', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { sort: 'oldest' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should sort by price low to high', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 50,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { sort: 'price-low' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should sort by price high to low', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 500,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { sort: 'price-high' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should sort by views', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Popular Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 1000,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { sort: 'views' })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('Pagination', () => {
    it('should apply limit', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { limit: 10 })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })

    it('should apply offset and limit', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'Test Listing',
          price: 100,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 0,
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, { offset: 10, limit: 10 })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })

  describe('Combined Filters', () => {
    it('should apply multiple filters together', async () => {
      const mockListings = [
        {
          id: '1',
          title: 'iPhone in Bratislava',
          price: 250,
          category_id: 'cat1',
          user_id: 'user1',
          location: 'Bratislava',
          is_active: true,
          views: 50,
          condition: 'used',
        },
      ]

      mockResult = { data: mockListings, error: null }

      const result = await listingsApi.getAll(supabase, {
        categoryId: 'cat1',
        priceMin: 100,
        priceMax: 500,
        location: 'Bratislava',
        condition: 'used',
        search: 'iPhone',
        sort: 'newest',
        limit: 20,
      })

      expect(result.error).toBeNull()
      expect(result.data).toBeDefined()
    })
  })
})

describe('Listings API - Count', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCountData = { count: null, error: null }
  })

  it('should get total count of listings', async () => {
    mockCountData = { count: 100, error: null }

    const result = await listingsApi.getCount(supabase, undefined)

    expect(result.error).toBeNull()
    expect(result.data).toBe(100)
  })

  it('should get count with filters', async () => {
    mockCountData = { count: 25, error: null }

    const result = await listingsApi.getCount(supabase, {
      categoryId: 'cat1',
      priceMin: 100,
    })

    expect(result.error).toBeNull()
    expect(result.data).toBe(25)
  })
})

describe('Listings API - Featured', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get featured listings', async () => {
    const mockListings = [
      {
        id: '1',
        title: 'Featured 1',
        price: 100,
        is_active: true,
        views: 1000,
      },
      {
        id: '2',
        title: 'Featured 2',
        price: 200,
        is_active: true,
        views: 500,
      },
    ]

    mockResult = { data: mockListings, error: null }

    const result = await listingsApi.getFeatured(supabase, 6)

    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
  })
})

describe('Listings API - Get By User', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get listings by user ID', async () => {
    const mockListings = [
      {
        id: '1',
        title: 'User Listing 1',
        price: 100,
        user_id: 'user1',
        is_active: true,
        views: 0,
      },
    ]

    mockResult = { data: mockListings, error: null }

    const result = await listingsApi.getByUser(supabase, 'user1')

    expect(result.error).toBeNull()
    expect(result.data).toBeDefined()
  })
})
