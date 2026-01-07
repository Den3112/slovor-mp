// Profile API
// Centralized API layer for profile statistics and analytics

import { supabase } from '@/lib/supabase/client'
import type { ApiResponse, Listing } from '@/lib/types/database'

export interface ProfileStats {
    totalViews: number
    activeListings: number
    inactiveListings: number
    favoritesCount: number
    avgViewsPerListing: number
    totalListings: number
}

/**
 * Fetches comprehensive profile statistics for a user
 * @param userId - User ID from Supabase Auth
 * @returns Profile statistics or error
 */
export const profileApi = {
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
            const totalViews = listings?.reduce((sum, l) => sum + (l.views || 0), 0) || 0
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
            return { data: null, error: (error as Error).message }
        }
    },

    /**
     * Fetches recent activity for a user
     * Returns last 5 listings with their activity data
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

            return { data: data || [], error: null }
        } catch (error) {
            return { data: null, error: (error as Error).message }
        }
    },
}
