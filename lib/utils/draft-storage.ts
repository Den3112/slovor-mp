// Draft Storage Utility
// Manages saving and loading listing drafts to localStorage

import type { ListingFormData } from '@/lib/utils/listing-form-schema'

const DRAFT_KEY_PREFIX = 'listing-draft:'

/**
 * Saves a listing draft for a specific user
 */
export const saveListingDraft = (userId: string | null, data: ListingFormData) => {
  if (typeof window === 'undefined' || !userId) return

  try {
    const key = `${DRAFT_KEY_PREFIX}${userId}`
    const payload = {
      data,
      timestamp: Date.now()
    }
    localStorage.setItem(key, JSON.stringify(payload))
  } catch (error) {
    console.error('Failed to save draft:', error)
  }
}

/**
 * Loads a listing draft for a specific user
 */
export const loadListingDraft = (userId: string | null | undefined): ListingFormData | null => {
  if (typeof window === 'undefined' || !userId) return null

  try {
    const key = `${DRAFT_KEY_PREFIX}${userId}`
    const item = localStorage.getItem(key)
    if (!item) return null

    const payload = JSON.parse(item)

    // Optional: expire drafts older than 7 days
    const expiration = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - payload.timestamp > expiration) {
      localStorage.removeItem(key)
      return null
    }

    return payload.data
  } catch (error) {
    console.error('Failed to load draft:', error)
    return null
  }
}

/**
 * Clears a listing draft for a specific user
 */
export const clearListingDraft = (userId: string | null | undefined) => {
  if (typeof window === 'undefined' || !userId) return

  try {
    const key = `${DRAFT_KEY_PREFIX}${userId}`
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Failed to clear draft:', error)
  }
}
