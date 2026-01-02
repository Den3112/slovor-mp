// Database types for Slovor Marketplace
// Simple, explicit type definitions (Principle #4: Clarity over magic)

export interface User {
  id: string
  username: string
  display_name: string | null
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  phone: string | null
  location: string | null
  verified: boolean
  created_at: string
  updated_at: string
}

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

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category_id: string | null
  user_id: string
  location: string
  featured: boolean
  // New fields from migration
  images: string[] // Array of image URLs
  condition: 'new' | 'used' // Product condition
  views: number // View counter
  is_active: boolean // Active status
  metadata: Record<string, unknown> | null
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
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
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
