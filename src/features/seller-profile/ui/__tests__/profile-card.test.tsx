import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProfileCard } from '@/features/seller-profile/ui/profile-card'
import type { Profile } from '@/shared/lib/types/database'

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

// Mock next/image
vi.mock('next/image', () => ({
  // eslint-disable-next-line @next/next/no-img-element
  default: (props: any) => <img alt={props.alt || ''} {...props} />,
}))

describe('ProfileCard', () => {
  const mockSeller: Partial<Profile> = {
    id: 'user-123',
    display_name: 'Super Seller',
    username: 'superseller',
    avatar_url: 'https://example.com/avatar.jpg',
    verified: true,
    bio: 'Experienced seller of fine goods.',
    location: 'Košice',
  }

  const defaultProps = {
    seller: mockSeller as Profile,
    listingsCount: 25,
    ratingData: { averageRating: 4.8, totalReviews: 12 },
    memberSince: '2023',
  }

  it('renders seller name and bio', () => {
    render(<ProfileCard {...defaultProps} />)
    expect(screen.getByText('Super Seller')).toBeInTheDocument()
    expect(
      screen.getByText('Experienced seller of fine goods.')
    ).toBeInTheDocument()
  })

  it('renders verification badges when seller is verified', () => {
    render(<ProfileCard {...defaultProps} />)
    expect(screen.getAllByText('trust:verified')).toHaveLength(1)
  })

  it('renders listing count and rating stats', () => {
    render(<ProfileCard {...defaultProps} />)
    expect(screen.getByText('25')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('seller:activeListings')).toBeInTheDocument()
    expect(screen.getByText('seller:rating')).toBeInTheDocument()
  })

  it('renders location and member since info', () => {
    render(<ProfileCard {...defaultProps} />)
    expect(screen.getByText('Košice')).toBeInTheDocument()
    expect(screen.getByText(/2023/)).toBeInTheDocument()
    expect(screen.getByText(/seller:memberSince/)).toBeInTheDocument()
  })

  it('handles missing rating data gracefully', () => {
    const propsNoRating = { ...defaultProps, ratingData: null }
    render(<ProfileCard {...propsNoRating} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders avatar image if URL is present', () => {
    render(<ProfileCard {...defaultProps} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })
})
