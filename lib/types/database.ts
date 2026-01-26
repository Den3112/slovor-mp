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

  // Promotion fields (Renamed from featured)
  is_promoted: boolean
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
  created_at: string

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
