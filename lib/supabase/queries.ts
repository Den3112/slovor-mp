import { supabase } from './client'
import type { Category, Listing, ApiResponse } from '../types/database'
export type { Category, Listing, ApiResponse }

// ========================================
// TYPES
// ========================================

export interface ListingFilterOptions {
  categoryId?: string
  categorySlug?: string
  search?: string
  limit?: number
  offset?: number
  priceMin?: number
  priceMax?: number
  condition?: 'new' | 'used'
  location?: string
  sort?: string
  isFeatured?: boolean
}

// ========================================
// HELPER FUNCTIONS (Private)
// ========================================

/**
 * Applies filters to listings query
 * Handles: category, search, price range, condition, location
 */
function applyListingFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options?: ListingFilterOptions
) {
  if (!options) { return query }

  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options.categorySlug) {
    query = query.eq('category.slug', options.categorySlug)
  }

  if (options.search) {
    const s = options.search.trim()
    // Для "идеального" поиска мы комбинируем:
    // 1. Точное совпадение (ilike) - самое приоритетное
    // 2. Полнотекстовый поиск (fts) - для морфологии
    // 3. Поиск по частям слов
    query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,title_sk.ilike.%${s}%,title_en.ilike.%${s}%`)
  }

  if (options.priceMin !== undefined) {
    query = query.gte('price', options.priceMin)
  }

  if (options.priceMax !== undefined) {
    query = query.lte('price', options.priceMax)
  }

  if (options.condition) {
    query = query.eq('condition', options.condition)
  }

  if (options.location && options.location !== 'all') {
    query = query.ilike('location', `%${options.location}%`)
  }

  if (options.isFeatured !== undefined) {
    query = query.eq('featured', options.isFeatured)
  }

  return query
}

/**
 * Applies sorting to listings query
 * Options: newest (default), oldest, price-low, price-high, views
 */
function applyListingSorting(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  sort?: string
) {
  switch (sort) {
    case 'oldest':
      return query.order('created_at', { ascending: true })
    case 'price-low':
      return query.order('price', { ascending: true })
    case 'price-high':
      return query.order('price', { ascending: false })
    case 'views':
      return query.order('views', { ascending: false })
    case 'newest':
    default:
      return query.order('created_at', { ascending: false })
  }
}

/**
 * Applies pagination to listings query
 */
function applyListingPagination(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options?: ListingFilterOptions
) {
  if (options?.offset !== undefined && options?.limit) {
    const from = options.offset
    const to = options.offset + options.limit - 1
    return query.range(from, to)
  }

  if (options?.limit) {
    return query.limit(options.limit)
  }

  return query
}

/**
 * Builds complete listings query with filters, sorting, and pagination
 */
function buildListingsQuery(options?: ListingFilterOptions) {
  let query = supabase
    .from('listings')
    .select('*, category:categories(*)')
    .eq('is_active', true)

  query = applyListingFilters(query, options)
  query = applyListingSorting(query, options?.sort)
  query = applyListingPagination(query, options)

  return query
}

// ========================================
// CATEGORIES API
// ========================================

export const categoriesApi = {
  /**
   * Fetches all categories with listing counts
   * @returns Array of categories ordered by name
   */
  async getAll(): Promise<ApiResponse<Category[]>> {
    try {
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (catError) { throw catError }

      // Get listing counts for each category
      const categoriesWithCount = await Promise.all(
        (categories || []).map(async (category) => {
          const { count } = await supabase
            .from('listings')
            .select('id', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('is_active', true)

          return {
            ...category,
            listing_count: count || 0,
          }
        })
      )

      return { data: categoriesWithCount, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches single category by slug with listing count
   * @param slug - Category slug (e.g., 'electronics')
   * @returns Category object or null if not found
   */
  async getBySlug(slug: string): Promise<ApiResponse<Category>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) { throw error }

      // Get listing count for this category
      const { count } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('category_id', data.id)
        .eq('is_active', true)

      return {
        data: {
          ...data,
          listing_count: count || 0,
        },
        error: null,
      }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}

// ========================================
// LISTINGS API
// ========================================

export const listingsApi = {
  /**
   * Fetches all listings with optional filtering and sorting
   * @param options - Filter and sort options
   * @returns Array of listings matching criteria
   *
   * @example
   * // Get all electronics listings
   * const result = await listingsApi.getAll({ categorySlug: 'electronics' })
   *
   * @example
   * // Search with price filter and pagination
   * const result = await listingsApi.getAll({
   *   search: 'laptop',
   *   priceMax: 1000,
   *   sort: 'price-low',
   *   limit: 20,
   *   offset: 0
   * })
   */
  async getAll(options?: ListingFilterOptions): Promise<ApiResponse<Listing[]>> {
    try {
      const query = buildListingsQuery(options)
      const { data, error } = await query

      if (error) { throw error }
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Get total count of listings matching filters
   * Used for pagination calculations
   */
  async getCount(options?: Omit<ListingFilterOptions, 'limit' | 'offset' | 'sort'>): Promise<ApiResponse<number>> {
    try {
      let query = supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)

      query = applyListingFilters(query, options)

      const { count, error } = await query

      if (error) { throw error }
      return { data: count || 0, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches single listing by ID and increments view count
   * @param id - Listing UUID
   * @returns Listing object with related category or null if not found
   */
  async getById(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error) { throw error }

      // Increment views (fire and forget)
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches featured listings sorted by view count
   * @param limit - Number of listings to return (default: 6)
   * @returns Array of most viewed listings
   */
  async getFeatured(limit = 6): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('views', { ascending: false })
        .limit(limit)

      if (error) { throw error }
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Creates a new listing
   * @param listing - Listing data to insert
   * @returns Created listing object
   */
  async create(listing: Partial<Listing>): Promise<ApiResponse<Listing>> {
    try {
      // Clean up the object to remove undefined fields and ensure required fields
      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listing,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active: true,
          views: 0,
        })
        .select()
        .single()

      if (error) { throw error }
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
  /**
   * Fetches for editing
   */
  async getForEdit(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('id', id)
        .maybeSingle()

      if (error) { throw error }
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches for user
   */
  async getByUser(userId: string): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) { throw error }
      return { data: data || [], error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Updates
   */
  async update(id: string, updates: Partial<Listing>): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error) { throw error }
      return { data, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Deletes
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id)
      if (error) { throw error }
      return { data: null, error: null }
    } catch (error) {
      return { data: null, error: (error as Error).message }
    }
  },
}
