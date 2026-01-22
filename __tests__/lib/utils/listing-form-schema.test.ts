import { describe, it, expect, vi } from 'vitest'
import { validateListingForm, hasListingFormErrors, DEFAULT_LISTING_FORM } from '@/lib/utils/listing-form-schema'

// Mock slovak cities validation
vi.mock('@/lib/constants/slovak-cities', () => ({
    isValidSlovakLocation: (loc: string) => loc === 'Bratislava'
}))

describe('listing-form-schema utility', () => {
    describe('validateListingForm', () => {
        it('returns errors for empty form', () => {
            const errors = validateListingForm(DEFAULT_LISTING_FORM)
            expect(errors.title).toBeDefined()
            expect(errors.price).toBeDefined()
            expect(errors.category_id).toBeDefined()
            expect(errors.location).toBeDefined()
        })

        it('validates price numericality', () => {
            const data = { ...DEFAULT_LISTING_FORM, price: 'abc' }
            const errors = validateListingForm(data)
            expect(errors.price).toBe('Price must be a positive number')
        })

        it('validates price positive values', () => {
            const data = { ...DEFAULT_LISTING_FORM, price: '-10' }
            const errors = validateListingForm(data)
            expect(errors.price).toBe('Price must be a positive number')
        })

        it('validates location against slovak cities', () => {
            const data = { ...DEFAULT_LISTING_FORM, location: 'Random Place' }
            const errors = validateListingForm(data)
            expect(errors.location).toBe('Please select a valid city in Slovakia')
        })

        it('returns no errors for valid data', () => {
            const data = {
                ...DEFAULT_LISTING_FORM,
                title: 'Test Title',
                price: '100',
                category_id: '1',
                location: 'Bratislava'
            }
            const errors = validateListingForm(data)
            expect(Object.keys(errors)).toHaveLength(0)
        })
    })

    describe('hasListingFormErrors', () => {
        it('returns true if any key error exists', () => {
            expect(hasListingFormErrors({ title: 'error' })).toBe(true)
            expect(hasListingFormErrors({ price: 'error' })).toBe(true)
        })

        it('returns false if no errors', () => {
            expect(hasListingFormErrors({})).toBe(false)
        })
    })
})
