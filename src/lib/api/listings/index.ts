import { supabase } from '@/lib/supabase/client'
import type { Listing, ApiResponse } from '@/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
export type { Listing }
import { logError } from '@/lib/utils/logger'
import { validateListingContent } from '@/lib/moderation'
import {
  applyListingFilters,
  applyListingSorting,
  applyListingPagination,
  type ListingFilterOptions,
} from './filters'
import { MOCK_LISTINGS } from './mock-listings'

export type { ListingFilterOptions }

function buildListingsQuery(
  options?: ListingFilterOptions,
  client?: SupabaseClient
) {
  const supabaseClient = client || supabase
  let query = supabaseClient
    .from('listings')
    .select('*, category:categories(*)')
    .eq('status', 'active')

  query = applyListingFilters(query, options)
  query = applyListingSorting(query, options?.sort)
  query = applyListingPagination(query, options)

  return query
}

export const listingsApi = {
  async getAll(
    options?: ListingFilterOptions,
    client?: SupabaseClient
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const query = buildListingsQuery(options, client)
      const { data, error } = await query
      if (error) {
        if (
          error.message?.includes('default credentials') ||
          (error as any).status === 500
        ) {
          console.warn('Supabase Error: Falling back to MOCK_LISTINGS')
          return { data: MOCK_LISTINGS as any as Listing[], error: null }
        }
        throw error
      }
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getAll', error)
      return { data: null, error: (error as Error).message }
    }
  },
  async getAdminAll(): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getAdminAll', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getCount(
    options?: Omit<ListingFilterOptions, 'limit' | 'offset' | 'sort'>,
    client?: SupabaseClient
  ): Promise<ApiResponse<number>> {
    try {
      const supabaseClient = client || supabase
      let query = supabaseClient
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'active')

      query = applyListingFilters(query, options)
      const { count, error } = await query
      if (error) {
        if (
          error.message?.includes('default credentials') ||
          (error as any).status === 500
        ) {
          return { data: MOCK_LISTINGS.length, error: null }
        }
        throw error
      }
      return { data: count || 0, error: null }
    } catch (error) {
      logError('listingsApi.getCount', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getPendingCount(): Promise<ApiResponse<number>> {
    try {
      const { count, error } = await supabase
        .from('listings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (error) throw error
      return { data: count || 0, error: null }
    } catch (error) {
      logError('listingsApi.getPendingCount', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getFeatured(limit: number = 6): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*)')
        .eq('status', 'active')
        .eq('is_highlighted', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getFeatured', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .eq('id', id)
        .eq('status', 'active')
        .maybeSingle()

      if (error) throw error
      if (!data) return { data: null, error: 'Listing not found' }

      await supabase
        .from('listings')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', id)
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getById', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getForEdit(id: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) throw error
      if (!data) return { data: null, error: 'Listing not found' }
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getForEdit', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async create(listing: Partial<Listing>): Promise<ApiResponse<Listing>> {
    try {
      const contentCheck = validateListingContent(
        listing.title || '',
        listing.description || '',
        listing.location
      )
      if (!contentCheck.isValid)
        return {
          data: null,
          error: contentCheck.error || 'Content validation failed',
        }

      const { data, error } = await supabase
        .from('listings')
        .insert({
          ...listing,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'active',
          views_count: 0,
        })
        .select()
        .maybeSingle()

      if (error) throw error
      if (!data) return { data: null, error: 'Failed to create listing' }
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.create', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async update(
    id: string,
    updates: Partial<Listing>
  ): Promise<ApiResponse<Listing>> {
    try {
      if (updates.title || updates.description || updates.location) {
        // To properly validate, we might need current state, but for now validate new values
        // If title is not updated, it's fine to leave empty or fetch current
        const contentCheck = validateListingContent(
          updates.title || '',
          updates.description || '',
          updates.location
        )
        if (!contentCheck.isValid)
          return {
            data: null,
            error: contentCheck.error || 'Content validation failed',
          }
      }

      const updateData = { ...updates, updated_at: new Date().toISOString() }
      Object.keys(updateData).forEach(
        (key) =>
          updateData[key as keyof typeof updateData] === undefined &&
          delete updateData[key as keyof typeof updateData]
      )

      const { data, error } = await supabase
        .from('listings')
        .update(updateData)
        .eq('id', id)
        .select()
        .maybeSingle()
      if (error) throw error
      if (!data)
        return { data: null, error: 'Listing not found or update failed' }
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.update', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async delete(id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from('listings').delete().eq('id', id)
      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.delete', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getByUser(
    userId: string,
    client?: SupabaseClient
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const supabaseClient = client || supabase
      const { data, error } = await supabaseClient
        .from('listings')
        .select('*, category:categories(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return { data: data || [], error: null }
    } catch (error) {
      logError('listingsApi.getByUser', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async getForOwner(id: string, userId: string): Promise<ApiResponse<Listing>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*, category:categories(*), user:profiles(*)')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle()
      if (error) throw error
      if (!data) return { data: null, error: 'Listing not found' }
      return { data, error: null }
    } catch (error) {
      logError('listingsApi.getForOwner', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async incrementContactClicks(id: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase.rpc('increment_contact_clicks', {
        listing_id: id,
      })
      if (error) throw error
      return { data: true, error: null }
    } catch (error) {
      logError('listingsApi.incrementContactClicks', error)
      return { data: null, error: (error as Error).message }
    }
  },

  async promote(
    id: string,
    type: string,
    duration: number,
    cost: number
  ): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase.rpc('promote_listing', {
        p_listing_id: id,
        p_promo_type: type,
        p_duration_days: duration,
        p_cost: cost,
      })
      if (error) throw error
      return { data: undefined, error: null }
    } catch (error) {
      logError('listingsApi.promote', error)
      return { data: null, error: (error as Error).message }
    }
  },
  async bulkDelete(ids: string[]): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase.from('listings').delete().in('id', ids)
      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.bulkDelete', error)
      return { data: null, error: (error as Error).message }
    }
  },
  async bulkUpdateStatus(
    ids: string[],
    status: Listing['status']
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', ids)
      if (error) throw error
      return { data: null, error: null }
    } catch (error) {
      logError('listingsApi.bulkUpdateStatus', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
