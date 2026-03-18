import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { Listing, ApiResponse } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'
import {
  applyListingFilters,
  applyListingSorting,
  applyListingPagination,
} from './listings/filters'
import type { ListingFilterOptions } from './listings'

export const serverListingsApi = {
  /**
   * Fetches listings for Server Components using shared filtering logic
   */
  getAll: cache(
    async (options?: ListingFilterOptions): Promise<ApiResponse<Listing[]>> => {
      try {
        const supabase = await createClient()

        let query = supabase
          .from('listings')
          .select('*, category:categories(*)')
          .eq('status', 'active')

        // Use unified filtering logic
        query = applyListingFilters(query, options)
        query = applyListingSorting(query, options?.sort)
        query = applyListingPagination(query, options)

        const { data, error } = await query

        if (error) throw error

        return { data: data || [], error: null }
      } catch (error) {
        logError('serverListingsApi.getAll', error)
        return { data: null, error: (error as Error).message }
      }
    }
  ),

  /**
   * Fetches featured listings using shared logic
   */
  getFeatured: cache(async (limit = 8): Promise<ApiResponse<Listing[]>> => {
    try {
      const supabase = await createClient()

      let query = supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .eq('is_highlighted', true) // Featured always highlighted
        .order('views_count', { ascending: false })
        .limit(limit)

      const { data, error } = await query

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      logError('serverListingsApi.getFeatured', error)
      return { data: null, error: (error as Error).message }
    }
  }),

  /**
   * Fetches recent listings
   */
  getRecent: cache(async (limit = 8): Promise<ApiResponse<Listing[]>> => {
    try {
      const supabase = await createClient()

      let query = supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit)

      const { data, error } = await query

      if (error) throw error

      return { data: data || [], error: null }
    } catch (error) {
      logError('serverListingsApi.getRecent', error)
      return { data: null, error: (error as Error).message }
    }
  }),
}
