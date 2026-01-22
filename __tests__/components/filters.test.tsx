import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ListingFilters } from '@/components/listing/filters'

const mockPush = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
    useSearchParams: () => ({
        get: (_key: string) => null,
        toString: () => '',
    }),
}))

// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
    useTranslation: () => ({
        t: {
            home: {
                searchPlaceholder: 'Search listings...',
            },
            filters: {
                location: 'Location',
                allLocations: 'All Locations',
                priceMin: 'Min Price',
                priceMax: 'Max Price',
                condition: 'Condition',
                new: 'New',
                used: 'Used',
                sort: 'Sort',
                newest: 'Newest',
                oldest: 'Oldest',
                priceLow: 'Price Low',
                priceHigh: 'Price High',
                popular: 'Popular',
                apply: 'Apply Filters',
            },
            common: {
                price: 'Price',
                all: 'All',
                loading: 'Loading...',
            },
        },
    }),
}))

describe('ListingFilters', () => {
    it('renders search input', () => {
        render(<ListingFilters />)
        expect(screen.getByPlaceholderText('Search listings...')).toBeInTheDocument()
    })

    it('updates search value on change', () => {
        render(<ListingFilters />)
        const input = screen.getByPlaceholderText('Search listings...')
        fireEvent.change(input, { target: { value: 'laptop' } })
        expect(input).toHaveValue('laptop')
    })

    it('renders price inputs', () => {
        render(<ListingFilters />)
        expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument()
    })

    it('updates price values on change', () => {
        render(<ListingFilters />)
        const minInput = screen.getByPlaceholderText('Min Price')
        const maxInput = screen.getByPlaceholderText('Max Price')

        fireEvent.change(minInput, { target: { value: '100' } })
        fireEvent.change(maxInput, { target: { value: '500' } })

        expect(minInput).toHaveValue(100)
        expect(maxInput).toHaveValue(500)
    })

    it('allows clicking condition buttons', () => {
        render(<ListingFilters />)
        const newButton = screen.getByRole('button', { name: /New/i })
        const usedButton = screen.getByRole('button', { name: /Used/i })

        fireEvent.click(newButton)
        expect(newButton).toHaveClass('bg-primary')

        fireEvent.click(usedButton)
        expect(usedButton).toHaveClass('bg-primary')
        expect(newButton).not.toHaveClass('bg-primary')
    })

    it('calls router.push when clicking apply', () => {
        render(<ListingFilters />)
        const applyButton = screen.getByRole('button', { name: /Apply Filters/i })
        fireEvent.click(applyButton)

        expect(mockPush).toHaveBeenCalled()
    })
})
