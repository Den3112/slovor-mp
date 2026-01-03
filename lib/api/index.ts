// API Entry Point
// Re-exports all API modules for convenient access

export type { Listing, Category, ApiResponse } from '@/lib/types/database'

export { categoriesApi } from './categories'
export { listingsApi } from './listings'
export { dashboardApi } from './dashboard'
export { storageApi } from './storage'
export { profilesApi } from './profiles'
export { favoritesApi } from './favorites'
export type { ListingFilterOptions } from './listings'
export type { DashboardStats } from './dashboard'
export type { UploadedFile } from './storage'
