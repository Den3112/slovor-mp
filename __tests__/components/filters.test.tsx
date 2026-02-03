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
// Mock useTranslation
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: any = {
        'home.searchPlaceholder': 'Search listings...',
        'filters:location': 'Location',
        'filters:allLocations': 'All Locations',
        'filters:priceMin': 'Min Price',
        'filters:priceMax': 'Max Price',
        'filters:condition': 'Condition',
        'filters:new': 'New',
        'filters:used': 'Used',
        'filters:sort': 'Sort',
        'filters:newest': 'Newest',
        'filters:oldest': 'Oldest',
        'filters:priceLow': 'Price Low',
        'filters:priceHigh': 'Price High',
        'filters:popular': 'Popular',
        'filters:apply': 'Apply Filters',
        'common:price': 'Price',
        'common:all': 'All',
        'common:loading': 'Loading...',
        'common:category': 'Category',
        'filters:allCategories': 'All Categories',
      }
      return translations[key] || key
    },
  }),
}))

describe('ListingFilters', () => {
  it('renders search input', () => {
    render(<ListingFilters categories={[]} />)
    expect(
      screen.getByPlaceholderText('Search listings...')
    ).toBeInTheDocument()
  })

  it('updates search value on change', () => {
    render(<ListingFilters categories={[]} />)
    const input = screen.getByPlaceholderText('Search listings...')
    fireEvent.change(input, { target: { value: 'laptop' } })
    expect(input).toHaveValue('laptop')
  })

  it('renders price inputs', () => {
    render(<ListingFilters categories={[]} />)
    expect(screen.getByPlaceholderText('Min Price')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Max Price')).toBeInTheDocument()
  })

  it('updates price values on change', () => {
    render(<ListingFilters categories={[]} />)
    const minInput = screen.getByPlaceholderText('Min Price')
    const maxInput = screen.getByPlaceholderText('Max Price')

    fireEvent.change(minInput, { target: { value: '100' } })
    fireEvent.change(maxInput, { target: { value: '500' } })

    expect(minInput).toHaveValue(100)
    expect(maxInput).toHaveValue(500)
  })

  it('allows clicking condition buttons', () => {
    render(<ListingFilters categories={[]} />)
    const newButton = screen.getByRole('button', { name: /New/i })
    const usedButton = screen.getByRole('button', { name: /Used/i })

    fireEvent.click(newButton)
    expect(newButton).toHaveClass('bg-primary')

    fireEvent.click(usedButton)
    expect(usedButton).toHaveClass('bg-primary')
    expect(newButton).not.toHaveClass('bg-primary')
  })

  it('calls router.push when clicking apply', () => {
    render(<ListingFilters categories={[]} />)
    const applyButton = screen.getByRole('button', { name: /Apply Filters/i })
    fireEvent.click(applyButton)

    expect(mockPush).toHaveBeenCalled()
  })
})
