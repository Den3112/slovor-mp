import type { ListingFormData } from '@/lib/utils/listing-form-schema'

const DRAFT_KEY_PREFIX = 'slovor-listing-draft:'

function getKey(userId: string | null | undefined): string | null {
  if (!userId) return null
  return `${DRAFT_KEY_PREFIX}${userId}`
}

export function saveListingDraft(userId: string | null | undefined, data: ListingFormData) {
  if (typeof window === 'undefined') return
  const key = getKey(userId)
  if (!key) return

  try {
    const serialized = JSON.stringify(data)
    window.localStorage.setItem(key, serialized)
  } catch {
    // ignore storage errors
  }
}

export function loadListingDraft(userId: string | null | undefined): ListingFormData | null {
  if (typeof window === 'undefined') return null
  const key = getKey(userId)
  if (!key) return null

  try {
    const value = window.localStorage.getItem(key)
    if (!value) return null
    return JSON.parse(value) as ListingFormData
  } catch {
    return null
  }
}

export function clearListingDraft(userId: string | null | undefined) {
  if (typeof window === 'undefined') return
  const key = getKey(userId)
  if (!key) return

  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
