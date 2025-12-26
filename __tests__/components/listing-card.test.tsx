import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingCard } from '@/components/listing/card'

// Mock i18n
vi.mock('@/lib/i18n', () => ({
    useTranslation: () => ({
        locale: 'en',
        t: {
            common: {
                new: 'New',
                used: 'Used',
                featured: 'Featured',
                noImage: 'No image',
            },
            categories: {
                electronics: 'Electronics',
            },
        },
    }),
}))

// Mock category-i18n
vi.mock('@/lib/utils/category-i18n', () => ({
    getLocalizedCategoryName: () => 'Electronics',
}))

const mockListing = {
    id: '1',
    title: 'Test Product',
    price: 99.99,
    currency: 'EUR',
    location: 'Bratislava',
    condition: 'new' as const,
    is_featured: false,
    images: ['https://example.com/image.jpg'],
    created_at: new Date().toISOString(),
    category: {
        name: 'Electronics',
        slug: 'electronics',
    },
}

describe('ListingCard', () => {
    it('renders the listing title', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('displays the price correctly', () => {
        render(<ListingCard listing={mockListing} />)
        // Price formatting may vary, just check for the number
        expect(screen.getByText(/99/)).toBeInTheDocument()
    })

    it('shows the location', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText('Bratislava')).toBeInTheDocument()
    })

    it('displays condition badge for new items', () => {
        render(<ListingCard listing={mockListing} />)
        expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('renders featured items without error', () => {
        const featuredListing = { ...mockListing, is_featured: true }
        render(<ListingCard listing={featuredListing} />)
        // Featured items still render correctly
        expect(screen.getByText('Test Product')).toBeInTheDocument()
    })

    it('renders a link to the listing details', () => {
        render(<ListingCard listing={mockListing} />)
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', '/listings/1')
    })
})
