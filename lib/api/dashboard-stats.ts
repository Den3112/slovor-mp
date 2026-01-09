import { createClient } from '@/lib/supabase/server'

export interface DashboardStats {
    activeListings: number
    totalViews: number
    favorites: number
    orders: number
    messages: number
    savedSearches: number
    reviews: number
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
    const supabase = await createClient()

    // Parallelize fetch for performance
    const [listingsRes, favoritesRes, savedSearchesRes, reviewsRes, conversationsRes] = await Promise.all([
        supabase
            .from('listings')
            .select('id, is_active, views', { count: 'exact' })
            .eq('user_id', userId),
        supabase
            .from('favorites')
            .select('id', { count: 'exact' })
            .eq('user_id', userId),
        supabase
            .from('saved_searches')
            .select('id', { count: 'exact' })
            .eq('user_id', userId),
        supabase
            .from('reviews')
            .select('id', { count: 'exact' })
            .eq('seller_id', userId),
        supabase
            .from('conversations')
            .select('id')
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    ])

    // Process Listings Data
    const listings = listingsRes.data || []
    const activeListings = listings.filter(l => l.is_active).length
    const totalViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0)

    // Process Favorites & Others
    const favorites = favoritesRes.count || 0
    const savedSearches = savedSearchesRes.count || 0
    const totalReviews = reviewsRes.count || 0

    // Process Unread Messages
    let unreadMessages = 0
    const conversationIds = conversationsRes.data?.map(c => c.id) || []

    if (conversationIds.length > 0) {
        const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id', conversationIds)
            .eq('is_read', false)
            .neq('sender_id', userId)

        unreadMessages = count || 0
    }

    // Mocked for now
    const orders = 0

    return {
        activeListings,
        totalViews,
        favorites,
        orders,
        messages: unreadMessages,
        savedSearches,
        reviews: totalReviews
    }
}
