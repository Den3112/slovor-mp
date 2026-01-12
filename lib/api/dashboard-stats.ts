import { createClient } from '@/lib/supabase/server'
import type { Conversation } from '@/lib/api/messages'

export interface DashboardStats {
    activeListings: number
    totalViews: number
    favorites: number
    orders: number
    messages: number // unread count
    savedSearches: number
    reviews: number
    recentConversations?: Conversation[]
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
        // Fetch full conversation data directly here instead of just IDs
        supabase
            .from('conversations')
            .select(`
                *,
                listing:listings (
                    id,
                    title,
                    images,
                    price
                ),
                buyer:profiles!conversations_buyer_id_fkey (
                    id,
                    display_name,
                    avatar_url
                ),
                seller:profiles!conversations_seller_id_fkey (
                    id,
                    display_name,
                    avatar_url
                ),
                messages (
                    id,
                    content,
                    created_at,
                    sender_id,
                    is_read
                )
            `)
            .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
            .order('updated_at', { ascending: false })
            .limit(3)
    ])

    // Process Listings Data
    const listings = listingsRes.data || []
    const activeListings = listings.filter(l => l.is_active).length
    const totalViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0)

    // Process Favorites & Others
    const favorites = favoritesRes.count || 0
    const savedSearches = savedSearchesRes.count || 0
    const totalReviews = reviewsRes.count || 0

    // Process Conversations & Unread Count from the same query if possible,
    // but the 'count' query was optimized. Let's process the detailed fetch.
    const recentConversations = (conversationsRes.data || []).map((c) => ({
        ...c,
        last_message: c.messages?.[0] || null // Since we order by created_at in messages? Wait, we need to order messages too.
    }))

    // We need to validte the message ordering.
    // The previous 'messages' select inside conversations fetch might not be ordered.
    // Supabase nested select ordering is tricky.
    // It's safer to re-map the last message if needed, or rely on the specific 'messages' query for unreads.

    // Let's re-calculate unread count properly across ALL conversations, not just the top 3.
    // We actually need a separate query for the total unread count if we only fetched 3 conversations above.

    // For ACCURACY, let's keep the dedicated unread count query but optimize it.
    // Actually, let's just do a separate quick count query.

    let unreadMessages = 0
    const { count: unreadCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', userId)
        .in('conversation_id', (
            // Subquery to get all user's conversation IDs
            // Note: Supabase JS client doesn't support complex subqueries easily in .in() directly with another builder sometimes.
            // But we can do:
            await supabase.from('conversations').select('id').or(`buyer_id.eq.${userId},seller_id.eq.${userId}`).then(res => res.data?.map(c => c.id) || [])
        ))

    unreadMessages = unreadCount || 0

    // Fix message ordering in the preview
    // We can't easily order nested relations in one go with Supabase JS v2 without weird syntax.
    // Getting the last message might require a separate approach or client-side sort.
    // Given we only have 3 convos, let's just sort the messages array for each (it will likely be small or we limit it).
    recentConversations.forEach(c => {
        if (c.messages && Array.isArray(c.messages)) {
            // Sort updates to get the latest
            c.messages.sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            c.last_message = c.messages[0]
        }
    })

    // Mocked for now
    const orders = 0

    return {
        activeListings,
        totalViews,
        favorites,
        orders,
        messages: unreadMessages,
        savedSearches,
        reviews: totalReviews,
        recentConversations
    }
}
