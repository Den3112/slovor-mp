import type { Conversation } from '@/entities/message/api'

export interface DashboardStats {
  activeListings: number
  totalViews: number
  favorites: number
  orders: number
  messages: number // unread count
  savedSearches: number
  reviews: number
  totalInquiries: number
  recentConversations?: Conversation[]
  walletBalance: number
  walletCurrency?: string
  rating?: number
}
