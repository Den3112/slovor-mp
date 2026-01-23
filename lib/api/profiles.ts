import { supabase } from '@/lib/supabase/client'
import type { User, ApiResponse, Listing } from '@/lib/types/database'
import { logError } from '@/lib/utils/logger'

export interface ProfileStats {
  totalViews: number
  activeListings: number
  inactiveListings: number
  favoritesCount: number
  avgViewsPerListing: number
  totalListings: number
}

export const profilesApi = {
  /**
   * Fetches a single profile by user ID
   */
  async getById(id: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Profile not found' }
      }

      return { data, error: null }
    } catch (error) {
      logError('profilesApi.getById', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches a profile by user ID, or returns empty profile data (for new users)
   */
  async getOrCreate(id: string, email?: string): Promise<ApiResponse<User>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle()

      if (error) {
        throw error
      }

      // If profile doesn't exist, return a default profile structure
      if (!data) {
        const defaultProfile: Partial<User> = {
          id,
          display_name: email?.split('@')[0] || '',
          bio: '',
          phone: '',
          location: '',
          avatar_url: '',
        }
        return { data: defaultProfile as User, error: null }
      }

      return { data, error: null }
    } catch (error) {
      logError('profilesApi.getOrCreate', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Updates a user profile (creates if doesn't exist)
   */
  async update(id: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    try {
      // Remove sensitive or read-only fields
      const {
        id: _,
        created_at: __,
        updated_at: ___,
        ...safeUpdates
      } = updates

      // Use upsert to create profile if it doesn't exist
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id, ...safeUpdates }, { onConflict: 'id' })
        .select()
        .maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        return { data: null, error: 'Profile update failed' }
      }

      return { data, error: null }
    } catch (error) {
      logError('profilesApi.update', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches comprehensive profile statistics for a user
   */
  async getStats(userId: string): Promise<ApiResponse<ProfileStats>> {
    try {
      // Get all user's listings
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('views, is_active')
        .eq('user_id', userId)

      if (listingsError) {
        throw listingsError
      }

      // Calculate statistics
      const totalListings = listings?.length || 0
      const activeListings = listings?.filter((l) => l.is_active).length || 0
      const inactiveListings = listings?.filter((l) => !l.is_active).length || 0
      const totalViews =
        listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0
      const avgViewsPerListing =
        totalListings > 0 ? Math.round(totalViews / totalListings) : 0

      // Get favorites count
      const { count: favoritesCount, error: favoritesError } = await supabase
        .from('favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

      if (favoritesError) {
        throw favoritesError
      }

      const stats: ProfileStats = {
        totalViews,
        activeListings,
        inactiveListings,
        favoritesCount: favoritesCount || 0,
        avgViewsPerListing,
        totalListings,
      }

      return { data: stats, error: null }
    } catch (error) {
      logError('profilesApi.getStats', error)
      return { data: null, error: (error as Error).message }
    }
  },

  /**
   * Fetches recent activity for a user
   */
  async getRecentActivity(
    userId: string,
    limit = 5
  ): Promise<ApiResponse<Listing[]>> {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(limit)

      if (error) {
        throw error
      }

      return { data: (data as Listing[]) || [], error: null }
    } catch (error) {
      logError('profilesApi.getRecentActivity', error)
      return { data: null, error: (error as Error).message }
    }
  },
}
export const usersApi = profilesApi
