export interface Profile {
  id: string
  first_name: string
  last_name: string
  avatar_url?: string
  phone?: string
  is_verified: boolean
  created_at: string
}

export interface Listing {
  id: string
  title: string
  description: string
  price: number
  category: string
  condition: 'new' | 'like_new' | 'used' | 'refurbished'
  location_region: string
  location_city: string
  location_zip: string
  user_id: string
  is_premium: boolean
  is_sold: boolean
  views_count: number
  created_at: string
  profiles?: Profile
  listings_images?: ListingImage[]
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  order: number
  is_primary: boolean
}

export interface Conversation {
  id: string
  listing_id: string
  buyer_id: string
  seller_id: string
  last_message_at: string
  listing?: Listing
  buyer?: Profile
  seller?: Profile
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  attachments?: string[]
  is_read: boolean
  created_at: string
}
