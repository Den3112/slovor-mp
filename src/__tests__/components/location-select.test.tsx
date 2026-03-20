import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LocationSelect } from '@/components/listing/filters/location-select'

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('LocationSelect', () => {
  it('renders correctly', () => {
    render(<LocationSelect value="" onChange={vi.fn()} />)
    expect(screen.getByText('filters:location')).toBeInTheDocument()
    expect(screen.getByText('filters:allLocations')).toBeInTheDocument()
  })

  it('shows selected location', () => {
    render(<LocationSelect value="Bratislava" onChange={vi.fn()} />)
    expect(screen.getByText('Bratislava')).toBeInTheDocument()
  })
})
