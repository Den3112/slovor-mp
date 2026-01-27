// Server-side Listings API
// For use in Server Components only

import { createClient } from '@/lib/supabase/server'
import type { Listing, ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export interface ServerListingFilterOptions {
  categoryId?: string
  limit?: number
  isFeatured?: boolean
  sort?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'views'
}

export const serverListingsApi = {
  /**
   * Fetches listings for Server Components
   */
  async getAll(
    options?: ServerListingFilterOptions
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const supabase = await createClient()

      let query = supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('status', 'active')

      if (options?.categoryId) {
        query = query.eq('category_id', options.categoryId)
      }

      if (options?.isFeatured !== undefined) {
        query = query.eq('is_highlighted', options.isFeatured)
      }

      // Apply sorting
      switch (options?.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true })
          break
        case 'price-low':
          query = query.order('price', { ascending: true })
          break
        case 'price-high':
          query = query.order('price', { ascending: false })
          break
        case 'views':
          query = query.order('views_count', { ascending: false })
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return { data: data || [], error: null }
    } catch (error) {
      logError('serverListingsApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches featured listings sorted by view count
   */
  async getFeatured(limit = 8): Promise<ApiResponse<Listing[]>> {
    try {
      const supabase = await createClient()

      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .order('views_count', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return { data: data || [], error: null }
    } catch (error) {
      logError('serverListingsApi.getFeatured', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
