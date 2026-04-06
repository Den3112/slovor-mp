import 'server-only'
import { createClient } from '@/shared/lib/supabase/server'
import type { DashboardStats } from './types'

export type { DashboardStats }

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
      ordersRes,
    ] = await Promise.all([
      supabase
        .from('listings')
        .select('id, status, views_count', { count: 'exact' })
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
        .select('rating', { count: 'exact' })
        .eq('recipient_id', userId),
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
      supabase.from('wallets').select('*').eq('user_id', userId).maybeSingle(),
      supabase
        .from('orders')
        .select('id', { count: 'exact' })
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`),
    ])

    // Process Listings Data
    const listings = listingsRes.data || []
    const activeListings = listings.filter((l) => l.status === 'active').length
    const totalViews = listings.reduce(
      (acc, curr) => acc + (curr.views_count || 0),
      0
    )

    // Process Favorites & Others
    const favorites = favoritesRes.count || 0
    const savedSearches = savedSearchesRes.count || 0
    const reviews = reviewsRes.data || []
    const totalReviews = reviews.length
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
          totalReviews
        : 5.0
    const totalOrders = ordersRes.count || 0

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

    const totalInquiries = conversationIds.length

    return {
      activeListings,
      totalViews,
      favorites,
      orders: totalOrders,
      messages: unreadMessages,
      savedSearches,
      reviews: totalReviews,
      totalInquiries,
      recentConversations,
      walletBalance: walletRes.data?.balance || 0,
      walletCurrency: walletRes.data?.currency || 'EUR',
      rating: averageRating,
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
      totalInquiries: 0,
      walletBalance: 0,
      recentConversations: [],
    }
  }
}
