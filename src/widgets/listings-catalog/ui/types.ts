import { Listing, Category } from '@/shared/lib/types/database'
import { ListingFilterOptions } from '@/entities/listing/api'

export interface ListingsHeaderProps {
  searchQuery?: string
  totalCount: number
  filters?: ListingFilterOptions
}

export interface MobileFilterDrawerProps {
  categories: Category[]
  totalCount: number
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export interface FilterSidebarProps {
  categories: Category[]
}

export interface ListingsGridProps {
  listings: Listing[]
  error: string | null
  loading: boolean
  hasMore: boolean
  observerTarget: React.RefObject<HTMLDivElement | null>
}
