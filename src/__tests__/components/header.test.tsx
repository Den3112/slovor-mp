import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/layout/header'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
}))

// Mock i18n
vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (key: string) => {
      const translations: any = {
        home: 'Home',
        allListings: 'All Listings',
        categories: 'Categories',
        'nav:categories': 'Categories', // key used in component
        searchPlaceholder: 'What are you looking for?',
        'common:searchPlaceholder': 'What are you looking for?',
        postAd: 'Post Ad',
        'nav:postAd': 'Post Ad', // key used in component
        dashboard: 'Dashboard',
        profile: 'Profile',
        signIn: 'Sign In',
        'common:signIn': 'Sign In', // likely key used due to different namespace
        signOut: 'Sign Out',
        signedInAs: 'Signed in as',
        hasAccount: "Don't have an account?",
      }
      return translations[key] || key
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

// Mock Categories API to prevent act() warning
vi.mock('@/lib/supabase/categories', () => ({
  getMainCategories: vi.fn(() => Promise.resolve({ data: [], error: null })),
}))

vi.mock('@/components/ui/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))

vi.mock('@/components/layout/language-selector', () => ({
  LanguageSelector: () => (
    <div data-testid="language-selector">LanguageSelector</div>
  ),
}))

vi.mock('@/components/layout/categories-dropdown', () => ({
  CategoriesDropdown: () => (
    <div data-testid="categories-dropdown">CategoriesDropdown</div>
  ),
}))

vi.mock('@/components/notifications/notification-dropdown', () => ({
  NotificationDropdown: () => (
    <div data-testid="notification-dropdown">NotificationDropdown</div>
  ),
}))

vi.mock('@/components/layout/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu">UserMenu</div>,
}))

vi.mock('@/components/layout/mobile-drawer', () => ({
  MobileDrawer: () => <div data-testid="mobile-drawer">MobileDrawer</div>,
}))

vi.mock('@/components/layout/bottom-nav-bar', () => ({
  BottomNavBar: () => <div data-testid="bottom-nav-bar">BottomNavBar</div>,
}))

// Mock Unread messages
vi.mock('@/lib/hooks/use-unread-messages', () => ({
  useUnreadMessages: () => 0,
}))

describe('Header', () => {
  it('renders the logo', () => {
    render(<Header />)
    expect(screen.getByText('Slovor')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Header />)
    // Home is accessed via Logo, so we only check generic nav items like Categories
    expect(screen.getAllByText('Categories').length).toBeGreaterThan(0)
  })

  it('shows Sign In when user is not logged in', () => {
    render(<Header />)
    // There might be multiple Sign In links (mobile + desktop)
    const signInLinks = screen.getAllByText('Sign In')
    expect(signInLinks.length).toBeGreaterThan(0)
  })

  it('renders Post Ad button', () => {
    render(<Header />)
    expect(screen.getAllByText('Post Ad').length).toBeGreaterThan(0)
  })
})
