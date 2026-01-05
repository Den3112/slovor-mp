// Listings API
// Centralized API layer for listings management

import { supabase } from '@/lib/supabase/client'
import type { Listing, ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export interface ListingFilterOptions {
  categoryId?: string
  categorySlug?: string
  search?: string
  limit?: number
  offset?: number
  page?: number
  priceMin?: number
  priceMax?: number
  condition?: 'new' | 'used'
  location?: string
  sort?: string
  isFeatured?: boolean
}

/**
 * Applies filters to listings query
 */
function applyListingFilters(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  options?: ListingFilterOptions
) {
  if (!options) {
    return query
  }

  if (options.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options.categorySlug) {
    query = query.eq('category.slug', options.categorySlug)
  }

  if (options.search) {
    const s = options.search.trim()
    query = query.or(
      `title.ilike.%${s}%,description.ilike.%${s}%,title_sk.ilike.%${s}%,title_cs.ilike.%${s}%,title_en.ilike.%${s}%`
    )
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

  // Handle page-based pagination (convert to offset)
  if (options?.page !== undefined && options?.limit) {
    const offset = (options.page - 1) * options.limit
    const from = offset
    const to = offset + options.limit - 1
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

export const listingsApi = {
  /**
   * Fetches all listings with optional filtering and sorting
   */
  async getAll(
    options?: ListingFilterOptions
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const query = buildListingsQuery(options)
      const { data, error } = await query

      if (error) {
        throw error
      }
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Get total count of listings matching filters
   */
  async getCount(
    options?: Omit<ListingFilterOptions, 'limit' | 'offset' | 'sort'>
  ): Promise<ApiResponse<number>> {
    try {
      let query = supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)

      query = applyListingFilters(query, options)

      const { count, error } = await query

      if (error) {
        throw error
      }
      return { data: count || 0, error: null }
    } catch (error) {
      logError('listingsApi.getCount', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches single listing by ID and increments view count
   */
  async getById(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .eq('id', id)
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Listing not found' }
      }

      // Increment views (fire and forget)
      await supabase
        .from('listings')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getById', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches listing for editing (ignoring active status, no view increment)
   */
  async getForEdit(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Listing not found' }
      }

      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getForEdit', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches featured listings sorted by view count
   */
  async getFeatured(limit = 6): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('is_active', true)
        .order('views', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getFeatured', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Creates a new listing
   */
  async create(listing: Partial<Listing>): Promise<ApiResponse<Listing>> {
    try {
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
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Failed to create listing' }
      }

      return { data, error: null }
    } catch (error) {
      logError('listingsApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches all listings for a specific user
   */
  async getByUser(userId: string): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getByUser', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Updates an existing listing
   */
  async update(
    id: string,
    updates: Partial<Listing>
  ): Promise<ApiResponse<Listing>> {
    try {
      // Create update object with timestamp
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      }

      // Remove any undefined fields to prevent Supabase errors
      Object.keys(updateData).forEach(
        (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
      )

      const { data, error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Listing not found or update failed' }
      }

      return { data, error: null }
    } catch (error) {
      logError('listingsApi.update', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Deletes a listing
   */
  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id)

      if (error) {
        throw error
      }
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.delete', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Increments the contact_clicks counter for a listing
   */
  async incrementContactClicks(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.rpc('increment_contact_clicks', {
        listing_id: id,
      })

      if (error) {
        throw error
      }
      return { data: true, error: null }
    } catch (error) {
      logError('listingsApi.incrementContactClicks', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
