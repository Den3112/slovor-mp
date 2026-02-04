// Database types for Slovor Marketplace
// Aligned with Master Plan Schema and lib/types/index.ts

export interface User {
  id: string
  username: string | null
  display_name: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  location: string | null
  verified: boolean
  is_verified: boolean // Added for consistency
  verification_level: 'none' | 'email' | 'phone' | 'documents'
  preferred_currency: string | null
  created_at: string
  updated_at: string
  role: 'user' | 'admin' | 'moderator'
  status: 'active' | 'banned' | 'suspended'
}

export type Profile = User

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  icon_name: string | null // Lucide icon name
  color: string | null
  order_index: number | null
  created_at: string
  parent_id?: string
  name_sk?: string
  name_cs?: string
  name_en?: string
  subcategories?: Category[]
  listing_count?: number
  listings_count?: number // Aligned with getCategoriesWithCounts API
}

export type ListingStatus = 'active' | 'pending' | 'rejected' | 'sold' | 'expired' | 'draft';

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category_id: string | null
  user_id: string
  location: string

  // Promotion fields
  is_highlighted: boolean
  promoted_until: string | null
  is_featured?: boolean // Legacy support (optional)

  images: string[] // Array of image URLs
  condition: 'new' | 'used' // Product condition

  views_count: number // Renamed from views
  views?: number // Legacy support

  status: ListingStatus
  is_active: boolean // Legacy support, derived from status === 'active'

  metadata: Record<string, unknown> | null
  attributes: Record<string, any> // Added for dynamic attributes

  created_at: string
  updated_at: string
  expires_at: string | null

  // Localization fields
  title_sk?: string | null
  title_cs?: string | null
  title_en?: string | null
  description_sk?: string | null
  description_cs?: string | null
  description_en?: string | null

  // Relations
  category?: Category
  user?: User
}

export interface Message {
  id: string
  listing_id: string | null
  sender_id: string
  recipient_id: string
  content: string
  read: boolean
  created_at: string
}

export interface Review {
  id: string
  listing_id: string | null
  author_id: string // Renamed from buyer_id
  recipient_id: string // Renamed from seller_id
  buyer_id?: string // Legacy support
  seller_id?: string // Legacy support

  rating: number
  comment: string | null
  seller_reply?: string | null
  seller_reply_at?: string | null
  created_at: string
  updated_at?: string

  // Joined fields
  author?: User
  recipient?: User
  listing?: Listing
}

export interface SavedListing {
  id: string
  user_id: string
  listing_id: string
  created_at: string
  listing?: Listing
}

export interface Wallet {
  id: string
  user_id: string
  balance: number
  currency: string
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  wallet_id: string
  amount: number
  currency: string
  type: 'deposit' | 'withdrawal' | 'promotion' | 'promotion_top' | 'promotion_highlight' | 'subscription' | 'payout' | 'refill' | 'purchase'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  description?: string | null
  metadata: Record<string, any>
  created_at: string
}

export interface Promotion {
  id: string
  listing_id: string
  user_id: string
  type: 'highlight' | 'top_search' | 'urgent' | 'homepage_featured' | 'promotion_top' | 'promotion_highlight'
  starts_at: string
  ends_at: string
  cost: number
  status: 'active' | 'expired' | 'cancelled'
  created_at: string
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_type: 'free' | 'pro' | 'business'
  status: string
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image: string | null
  author_id: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  author?: User
}

export interface StaticPage {
  id: string
  slug: string
  title: string
  content: string
  updated_at: string
}

export interface ListingReport {
  id: string
  listing_id: string | null
  reported_user_id: string | null
  reporter_id: string | null
  reason: string
  description: string | null
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  admin_notes?: string | null
  created_at: string
  resolved_at?: string | null
}

export interface UserVerification {
  id: string
  user_id: string
  type: 'email' | 'phone' | 'id_document' | 'address' | 'business'
  document_url?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_notes?: string | null
  verified_at: string | null
  created_at: string
  updated_at?: string

  // Relations
  user?: User
  profile?: User // Often used interchangeably
}

export interface ActivityLog {
  id: string
  user_id: string | null
  action: string
  metadata: Record<string, any>
  ip_address: string | null
  created_at: string
}

export interface Order {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method: 'wallet' | 'stripe' | 'paypal'
  metadata: Record<string, any>
  created_at: string
  updated_at: string

  // Relations
  listing?: Listing
  buyer?: Profile
  seller?: Profile
}

// API Response types (Principle #5: Errors are part of design)
export type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string }

export type ApiListResponse<T> = ApiResponse<{
  items: T[]
  total: number
  page: number
  perPage: number
}>
