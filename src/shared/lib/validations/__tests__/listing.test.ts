import { describe, it, expect } from 'vitest'
import { createListingSchema, listingFilterSchema } from '../listing'

describe('Listing Validations', () => {
  describe('createListingSchema', () => {
    const validListing = {
      title: 'Predám iPhone 15 Pro Max 256GB',
      description: 'Telefón je v top stave, bez škrabancov, kompletné balenie.',
      price: 999,
      condition: 'like_new',
      category: 'electronics',
      location_region: 'Bratislavský kraj',
      location_city: 'Bratislava',
      location_zip: '811 01',
      images: ['img1.jpg'],
      contact_phone: '0912345678',
    }

    it('validates a correct listing input', () => {
      const result = createListingSchema.safeParse(validListing)
      expect(result.success).toBe(true)
    })

    it('fails on short title', () => {
      const input = { ...validListing, title: 'Krátky' }
      const result = createListingSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Názov musí mať aspoň 10 znakov.'
        )
      }
    })

    it('fails on short description', () => {
      const input = { ...validListing, description: 'Príliš krátky popis' }
      const result = createListingSchema.safeParse(input)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0]?.message).toBe(
          'Popis musí mať aspoň 20 znakov.'
        )
      }
    })

    it('fails on negative price', () => {
      const input = { ...validListing, price: -10 }
      const result = createListingSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('fails on invalid zip code', () => {
      const input = { ...validListing, location_zip: '123' }
      const result = createListingSchema.safeParse(input)
      expect(result.success).toBe(false)
    })

    it('fails if no images provided', () => {
      const input = { ...validListing, images: [] }
      const result = createListingSchema.safeParse(input)
      expect(result.success).toBe(false)
    })
  })

  describe('listingFilterSchema', () => {
    it('validates empty filters', () => {
      const result = listingFilterSchema.safeParse({})
      expect(result.success).toBe(true)
    })

    it('validates full filters', () => {
      const input = {
        query: 'iphone',
        category: 'electronics',
        priceMin: 500,
        priceMax: 1500,
        condition: ['new', 'like_new'],
        sort: 'price_asc',
        page: 2,
      }
      const result = listingFilterSchema.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('coerces price strings to numbers', () => {
      const input = { priceMin: '100', priceMax: '200' }
      const result = listingFilterSchema.safeParse(input)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.priceMin).toBe(100)
        expect(result.data.priceMax).toBe(200)
      }
    })
  })
})
