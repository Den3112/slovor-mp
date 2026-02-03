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
  walletBalance?: number
  walletCurrency?: string
}



export async function getDashboardStats(
  userId: string
): Promise<DashboardStats> {
  const supabase = await createClient()

  try {
    // Parallelize fetch for performance
    const [
      listingsRes,
      favoritesRes,
      savedSearchesRes,
      reviewsRes,
      conversationsRes,
      walletRes,
    ] = await Promise.all([
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
        .select(
          `
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
                `
        )
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .order('updated_at', { ascending: false })
        .limit(3),
      supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single(),
    ])

    // Process Listings Data
    const listings = listingsRes.data || []
    const activeListings = listings.filter((l) => l.is_active).length
    const totalViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0)

    // Process Favorites & Others
    const favorites = favoritesRes.count || 0
    const savedSearches = savedSearchesRes.count || 0
    const totalReviews = reviewsRes.count || 0

    // Process Conversations
    const recentConversations = (conversationsRes.data || []).map((c) => ({
      ...c,
      last_message: c.messages?.[0] || null,
    }))

    // 2. Optimized Unread Messages Count
    const { data: convData } = await supabase
      .from('conversations')
      .select('id')
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)

    const conversationIds = convData?.map((c) => c.id) || []

    let unreadMessages = 0
    if (conversationIds.length > 0) {
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', userId)
        .in('conversation_id', conversationIds)

      unreadMessages = unreadCount || 0
    }

    // Sort messages
    recentConversations.forEach((c) => {
      if (c.messages && Array.isArray(c.messages)) {
        c.messages.sort(
          (a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        c.last_message = c.messages[0]
      }
    })

    const orders = 0

    return {
      activeListings,
      totalViews,
      favorites,
      orders,
      messages: unreadMessages,
      savedSearches,
      reviews: totalReviews,
      recentConversations,
      walletBalance: walletRes.data?.balance || 0,
      walletCurrency: walletRes.data?.currency || 'EUR',
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return {
      activeListings: 0,
      totalViews: 0,
      favorites: 0,
      orders: 0,
      messages: 0,
      savedSearches: 0,
      reviews: 0,
      recentConversations: [],
    }
  }
}
