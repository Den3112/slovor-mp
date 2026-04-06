import { Listing } from '@/shared/lib/types/database'

export interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

export interface PaginatedResponse<T> {
  items: T[]
  totalCount: number
  nextCursor?: string
  hasNextPage: boolean
}

export interface ListingsSearchResponse extends PaginatedResponse<Listing> {}

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'popular'

export interface SearchFilters {
  query?: string
  category?: string
  region?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  condition?: string[]
  sort?: SortOption
}
