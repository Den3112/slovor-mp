import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ActivityFeed } from '@/features/seller-profile/ui/activity-feed'

// Mock useTranslation
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, options?: any) => {
      if (options?.user && options?.item)
        return `${key} by ${options.user} for ${options.item}`
      if (options?.item && options?.count)
        return `${key} for ${options.item} (${options.count})`
      if (options?.item && options?.days)
        return `${key} for ${options.item} in ${options.days} days`
      return key
    },
  }),
}))

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

describe('ActivityFeed', () => {
  it('renders all activity items from the mock list', () => {
    render(<ActivityFeed />)

    // Check titles (translated keys)
    expect(
      screen.getByText('dashboard:activityLog.entries.newMessage')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dashboard:activityLog.entries.itemsSold')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dashboard:activityLog.entries.listingFavorited')
    ).toBeInTheDocument()
    expect(
      screen.getByText('dashboard:activityLog.entries.listingExpiring')
    ).toBeInTheDocument()
  })

  it('renders descriptions with interpolated values', () => {
    render(<ActivityFeed />)

    expect(screen.getByText(/Peter/)).toBeInTheDocument()
    expect(screen.getByText(/iPhone 15/)).toBeInTheDocument()
    expect(screen.getByText(/Acoustic Guitar/)).toBeInTheDocument()
    expect(screen.getByText(/MacBook M3/)).toBeInTheDocument()
    expect(screen.getByText(/Vintage Watch/)).toBeInTheDocument()
  })

  it('renders time badges', () => {
    render(<ActivityFeed />)
    expect(screen.getByText('2m')).toBeInTheDocument()
    expect(screen.getByText('45m')).toBeInTheDocument()
    expect(screen.getByText('1h')).toBeInTheDocument()
    expect(screen.getByText('3h')).toBeInTheDocument()
  })
})
