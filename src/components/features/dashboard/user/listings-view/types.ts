export type ListingStatus =
  | 'active'
  | 'sold'
  | 'draft'
  | 'pending'
  | 'rejected'
  | 'expired'

export interface Listing {
  id: string
  title: string
  price: number
  currency: string
  status: ListingStatus
  created_at: string
  images: string[]
  views_count: number
  favorites_count: number
}

export interface UserListingsViewProps {
  initialListings: any[]
}
