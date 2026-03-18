import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Set environment variables for tests if not already set (allowing CI secrets to take precedence)
process.env.NEXT_PUBLIC_SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-key'
process.env.NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
process.env.NEXT_PUBLIC_ENABLE_AUTH =
  process.env.NEXT_PUBLIC_ENABLE_AUTH || 'true'
process.env.NEXT_PUBLIC_ENABLE_PAYMENTS =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS || 'true'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock next/image
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    priority,
    fill,
    unoptimized,
    ...props
  }: {
    src: string
    alt: string
    priority?: boolean
    fill?: boolean
    unoptimized?: boolean
  }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />
  },
}))

// Mock API services
export const mockCategoriesApi = {
  getAll: vi.fn().mockResolvedValue({ data: [], error: null }),
  getById: vi.fn().mockResolvedValue({ data: null, error: null }),
}

export const mockListingsApi = {
  getAll: vi.fn().mockResolvedValue({ data: [], error: null }),
  getById: vi.fn().mockResolvedValue({ data: null, error: null }),
  getFeatured: vi.fn().mockResolvedValue({ data: [], error: null }),
  create: vi.fn().mockResolvedValue({ data: null, error: null }),
  update: vi.fn().mockResolvedValue({ data: null, error: null }),
  delete: vi.fn().mockResolvedValue({ data: null, error: null }),
}

vi.mock('@/lib/api', () => ({
  categoriesApi: mockCategoriesApi,
  listingsApi: mockListingsApi,
}))

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      eq: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
    })),
  }),
  supabase: {
    auth: {
      getSession: vi
        .fn()
        .mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi
        .fn()
        .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      upsert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    })),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    storage: {
      from: vi.fn(() => ({
        upload: vi
          .fn()
          .mockResolvedValue({ data: { path: 'test' }, error: null }),
        getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'test' } }),
        remove: vi.fn().mockResolvedValue({ error: null }),
      })),
    },
  },
}))

// Mock ResizeObserver
if (typeof globalThis !== 'undefined') {
  ;(globalThis as any).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
