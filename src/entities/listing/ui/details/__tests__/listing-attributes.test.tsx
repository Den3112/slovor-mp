import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingDetailsGrid } from '@/entities/listing/ui/details/listing-attributes'
import type { Listing } from '@/shared/lib/types/database'

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}))

describe('ListingDetailsGrid', () => {
  const mockListing: Partial<Listing> = {
    id: '1',
    condition: 'new',
    location: 'Bratislava',
    created_at: '2024-01-01T12:00:00Z',
  }

  it('renders condition, location and date correctly', () => {
    render(<ListingDetailsGrid listing={mockListing as Listing} />)

    expect(screen.getByText('common:condition')).toBeInTheDocument()
    expect(screen.getByText('common:new')).toBeInTheDocument()
    expect(screen.getByText('Bratislava')).toBeInTheDocument()
    expect(screen.getByText('common:published')).toBeInTheDocument()
  })

  it('shows "used" condition when applicable', () => {
    const usedListing = { ...mockListing, condition: 'used' }
    render(<ListingDetailsGrid listing={usedListing as Listing} />)

    expect(screen.getByText('common:used')).toBeInTheDocument()
  })

  it('formats the date according to locale', () => {
    render(<ListingDetailsGrid listing={mockListing as Listing} />)
    // 2024-01-01 in en locale is typically 1/1/2024
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })
})
