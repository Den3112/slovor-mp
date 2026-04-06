import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/widgets/header'
import { NuqsTestingAdapter } from 'nuqs/adapters/testing'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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
vi.mock('@/shared/lib/i18n', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    t: (key: string) => {
      const translations: any = {
        home: 'Home',
        allListings: 'All Listings',
        categories: 'Categories',
        'nav:categories': 'Categories',
        searchPlaceholder: 'What are you looking for?',
        'common:searchPlaceholder': 'What are you looking for?',
        postAd: 'Post Ad',
        'nav:postAd': 'Post Ad',
        dashboard: 'Dashboard',
        profile: 'Profile',
        signIn: 'Sign In',
        'common:signIn': 'Sign In',
        signOut: 'Sign Out',
        signedInAs: 'Signed in as',
        hasAccount: "Don't have an account?",
      }
      return translations[key] || key
    },
  }),
}))

// Mock useAuth
vi.mock('@/app/providers/auth-provider', () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
    isLoading: false,
  }),
}))

// Mock Categories API
vi.mock('@/shared/lib/supabase/categories', () => ({
  getMainCategories: vi.fn(() => Promise.resolve({ data: [], error: null })),
}))

vi.mock('@/shared/ui/theme-toggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">ThemeToggle</div>,
}))

vi.mock('@/widgets/language-selector', () => ({
  LanguageSelector: () => (
    <div data-testid="language-selector">LanguageSelector</div>
  ),
}))

vi.mock('@/widgets/categories-dropdown', () => ({
  CategoriesDropdown: () => (
    <div data-testid="categories-dropdown">CategoriesDropdown</div>
  ),
}))

vi.mock('@/components/notifications/notification-dropdown', () => ({
  NotificationDropdown: () => (
    <div data-testid="notification-dropdown">NotificationDropdown</div>
  ),
}))

vi.mock('@/widgets/user-menu', () => ({
  UserMenu: () => <div data-testid="user-menu">UserMenu</div>,
}))

vi.mock('@/widgets/mobile-drawer', () => ({
  MobileDrawer: () => <div data-testid="mobile-drawer">MobileDrawer</div>,
}))

vi.mock('@/widgets/bottom-nav-bar', () => ({
  BottomNavBar: () => <div data-testid="bottom-nav-bar">BottomNavBar</div>,
}))

// Mock Unread messages
vi.mock('@/entities/chat/hooks', () => ({
  useUnreadMessages: () => 0,
}))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
})

const renderHeader = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NuqsTestingAdapter>
        <Header />
      </NuqsTestingAdapter>
    </QueryClientProvider>
  )
}

describe('Header', () => {
  it('renders the logo', () => {
    renderHeader()
    expect(screen.getByText('Slovor')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getAllByText('Categories').length).toBeGreaterThan(0)
  })

  it('shows Sign In when user is not logged in', () => {
    renderHeader()
    const signInLinks = screen.getAllByText('Sign In')
    expect(signInLinks.length).toBeGreaterThan(0)
  })

  it('renders Post Ad button', () => {
    renderHeader()
    expect(screen.getAllByText('Post Ad').length).toBeGreaterThan(0)
  })
})
