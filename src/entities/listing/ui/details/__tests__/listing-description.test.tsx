import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ListingDescription } from '@/entities/listing/ui/details/listing-description'

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('ListingDescription', () => {
  it('renders description heading and content', () => {
    const description = 'Test description for item'
    render(<ListingDescription description={description} />)

    expect(screen.getByText('listing:itemDescription')).toBeInTheDocument()
    expect(screen.getByText(description)).toBeInTheDocument()
  })

  it('preserves whitespace in description', () => {
    const description = 'Line 1\nLine 2'
    render(<ListingDescription description={description} />)

    const element = screen.getByText(/Line 1/)
    expect(element).toHaveClass('whitespace-pre-wrap')
  })
})
