// Supabase API queries
// This file now re-exports from modular API structure for backward compatibility
// New code should import from '@/lib/api' instead

export { categoriesApi, listingsApi } from '@/lib/api'
export type { ListingFilterOptions } from '@/lib/api'
export type { Category, Listing, ApiResponse } from '@/lib/types/database'
