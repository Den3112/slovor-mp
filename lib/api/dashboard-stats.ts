import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
    activeListings: number
    totalViews: number
    favorites: number
    orders: number
    messages: number
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
    const supabase = await createClient()

    // Parallelize fetch for performance
    const [listingsRes, favoritesRes] = await Promise.all([
        supabase
            .from('listings')
            .select('id, is_active, views', { count: 'exact' })
            .eq('user_id', userId),
        supabase
            .from('favorites')
            .select('id', { count: 'exact' })
            .eq('user_id', userId)
    ])

    // Process Listings Data
    const listings = listingsRes.data || []
    const activeListings = listings.filter(l => l.is_active).length
    const totalViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0)

    // Process Favorites Data
    const favorites = favoritesRes.count || 0

    // Mocked for now (Tables might not exist or populate yet)
    const orders = 0
    const messages = 0

    return {
        activeListings,
        totalViews,
        favorites,
        orders,
        messages
    }
}
