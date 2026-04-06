import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SearchFilters } from '@/features/search/ui/search-filters'
import { useRouter, useSearchParams } from 'next/navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}))

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    locale: 'en',
  }),
}))

// Mock Radix UI components that might be complex to test directly
vi.mock('@/shared/ui/slider', () => ({
  Slider: ({ onValueChange, onValueCommit, value }: any) => (
    <input
      type="range"
      data-testid="price-slider"
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value), value[1]])}
      onBlur={() => onValueCommit(value)}
    />
  ),
}))

describe('SearchFilters', () => {
  const mockPush = vi.fn()
  const mockSearchParams = new URLSearchParams()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as any).mockReturnValue({ push: mockPush })
    ;(useSearchParams as any).mockReturnValue(mockSearchParams)
  })

  it('renders basic filters (price, condition, location)', () => {
    render(<SearchFilters />)

    expect(screen.getByText('common:price')).toBeInTheDocument()
    expect(screen.getByText('filters:condition')).toBeInTheDocument()
    expect(screen.getByText('filters:location')).toBeInTheDocument()
  })

  it('updates location filter on blur', () => {
    render(<SearchFilters />)
    const locationInput = screen.getByPlaceholderText('filters:cityPlaceholder')

    fireEvent.change(locationInput, { target: { value: 'Bratislava' } })
    fireEvent.blur(locationInput)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('location=Bratislava')
    )
  })

  it('updates condition filter on checkbox click', () => {
    render(<SearchFilters />)
    const newCheckbox = screen.getByLabelText('filters:new')

    fireEvent.click(newCheckbox)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('condition=new')
    )
  })

  it('renders dynamic attributes when category is selected', () => {
    mockSearchParams.set('category', 'electronics')
    render(<SearchFilters />)

    expect(screen.getByText('Brand')).toBeInTheDocument()
    expect(screen.getByText('Storage')).toBeInTheDocument()
  })

  it('clears all filters when clear button is clicked', () => {
    mockSearchParams.set('location', 'Bratislava')
    render(<SearchFilters />)

    const clearButton = screen.getByText('filters:clearAll')
    fireEvent.click(clearButton)

    expect(mockPush).toHaveBeenCalledWith('/en/search')
  })

  it('updates price filter on input change', () => {
    render(<SearchFilters />)
    const minPriceInput = screen.getByPlaceholderText('filters:priceMin')

    fireEvent.change(minPriceInput, { target: { value: '100' } })
    fireEvent.blur(minPriceInput)

    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('minPrice=100')
    )
  })
})
