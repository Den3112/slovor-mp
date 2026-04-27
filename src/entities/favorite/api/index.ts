// Favorites API
// Centralized API layer for managing favorited listings

// import { supabase } from '@/shared/lib/supabase/client'
// Global browser client import REMOVED to prevent SSR evaluation crashes.
// Every method must now receive a SupabaseClient as an argument.
import type { Listing, ApiResponse } from '@/shared/lib/types/database'
import type { SupabaseClient } from '@supabase/supabase-js'
import { logError } from '@/shared/lib/utils/logger'

export const favoritesApi = {
  /**
   * Fetches all favorited listings for a specific user
   */
  async getByUser(
    client: SupabaseClient,
    userId: string
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await client
        .from('favorites')
        .select(
          `
          listing_id,
          listing:listings (
            *,
            category:categories (*)
          )
        `
        )
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      // Map the nested listing data to a flat array
      const listings = (data as unknown as { listing: Listing }[])
        ?.map((item) => item.listing)
        .filter((l): l is Listing => l !== null)

      return { data: listings || [], error: null }
    } catch (error) {
      logError('favoritesApi.getByUser', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Toggles favorite status for a listing
   */
  async toggle(
    client: SupabaseClient,
    listingId: string,
    userId: string
  ): Promise<ApiResponse<{ isFavorited: boolean }>> {
    try {
      // Check if already favorited
      const { data: existing, error: fetchError } = await client
        .from('favorites')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchError) {
        throw fetchError
      }

      if (existing) {
        // Remove from favorites
        const { error: deleteError } = await client
          .from('favorites')
          .delete()
          .eq('id', existing.id)

        if (deleteError) {
          throw deleteError
        }

        return { data: { isFavorited: false }, error: null }
      } else {
        // Add to favorites
        const { error: insertError } = await client.from('favorites').insert({
          listing_id: listingId,
          user_id: userId,
          created_at: new Date().toISOString(),
        })

        if (insertError) {
          throw insertError
        }

        return { data: { isFavorited: true }, error: null }
      }
    } catch (error) {
      logError('favoritesApi.toggle', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Checks if a listing is favorited by a user
   */
  async isFavorited(
    client: SupabaseClient,
    listingId: string,
    userId: string
  ): Promise<ApiResponse<boolean>> {
    try {
      const { data, error } = await client
        .from('favorites')
        .select('id')
        .eq('listing_id', listingId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        throw error
      }

      return { data: Boolean(data), error: null }
    } catch (error) {
      logError('favoritesApi.isFavorited', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
