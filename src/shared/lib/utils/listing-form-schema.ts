import { isValidSlovakLocation } from '@/shared/lib/constants/slovak-cities'

export type ListingCondition = 'new' | 'used'

export interface ListingFormData {
  title: string
  description: string
  price: string
  currency: 'EUR'
  category_id: string
  condition: ListingCondition
  location: string
  images: string[]
  attributes: Record<string, any>
}

export interface ListingFormErrors {
  title?: string
  price?: string
  category_id?: string
  location?: string
  description?: string
  condition?: string
}

export const DEFAULT_LISTING_FORM: ListingFormData = {
  title: '',
  description: '',
  price: '',
  currency: 'EUR',
  category_id: '',
  condition: 'new',
  location: '',
  images: [],
  attributes: {},
}

export function validateListingForm(
  values: ListingFormData
): ListingFormErrors {
  const errors: ListingFormErrors = {}

  if (!values.title.trim()) {
    errors.title = 'Title is required'
  }

  if (!values.category_id) {
    errors.category_id = 'Category is required'
  }

  if (!values.price.trim()) {
    errors.price = 'Price is required'
  } else {
    const priceNumber = Number(values.price)
    if (Number.isNaN(priceNumber) || priceNumber <= 0) {
      errors.price = 'Price must be a positive number'
    }
  }

  if (!values.location.trim()) {
    errors.location = 'Location is required'
  } else if (!isValidSlovakLocation(values.location)) {
    errors.location = 'Please select a valid city in Slovakia'
  }

  return errors
}

export function hasListingFormErrors(errors: ListingFormErrors): boolean {
  return Boolean(
    errors.title || errors.price || errors.category_id || errors.location
  )
}
