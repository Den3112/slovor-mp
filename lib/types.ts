export interface Listing {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category_id: string
  user_id: string
  location: string
  status: 'active' | 'sold' | 'archived'
  images: string[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  order_index: number
  created_at: string
}

export interface User {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}
