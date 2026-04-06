export * from '@/shared/lib/types/database'

// Additional specific types if needed
import type { Listing } from '@/shared/lib/types/database'

export interface ListingWithProfile extends Listing {
  profiles?: {
    full_name?: string
    avatar_url?: string
  }
}
