import type { Listing } from '@/lib/types/database'

export type { Listing, ListingWithProfile } from '@/types/listing'

export interface UserListingsViewProps {
  initialListings?: Listing[]
}
