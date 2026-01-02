import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    locale: 'en',
    setLocale: vi.fn(),
    t: {
      common: {
        home: 'Home',
        allListings: 'All Listings',
        categories: 'Categories',
        searchPlaceholder: 'What are you looking for?',
        postAd: 'Post Ad',
        dashboard: 'Dashboard',
        profile: 'Profile',
      },
      auth: {
        signIn: 'Sign In',
        signOut: 'Sign Out',
        signedInAs: 'Signed in as',
        hasAccount: "Don't have an account?",
      },
    },
  }),
}))

// Mock useAuth
vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
    isLoading: false,
  }),
}))

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)
    expect(screen.getByText('Slovor')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  it('shows Sign In when user is not logged in', () => {
    render(<Header />)
    // There might be multiple Sign In links (mobile + desktop)
    const signInLinks = screen.getAllByText('Sign In')
    expect(signInLinks.length).toBeGreaterThan(0)
  })

  it('renders Post Ad button', () => {
    render(<Header />)
    expect(screen.getByText('Post Ad')).toBeInTheDocument()
  })
})
