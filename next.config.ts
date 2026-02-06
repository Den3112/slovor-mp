import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: 'standalone',

  // Ignore TypeScript errors during build (they're checked in CI separately)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Experimental features for performance
  experimental: {
    // Optimize package imports for faster builds
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'sonner',
      'date-fns',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-tabs',
      '@radix-ui/react-avatar',
      '@radix-ui/react-popover',
      '@radix-ui/react-label',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-switch',
      '@radix-ui/react-slider',
    ],
  },

  images: {
    // Allow external image domains
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: 'hnkhwvhjwygolvwvxnor.supabase.co',
      },
    ],
    // Enable SVG support for Dicebear avatars
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    // Disable optimization for faster loading of external images
    unoptimized: false,
    // Use smaller device sizes for faster loading
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  async rewrites() {
    return [
      // Static files - prevent locale prefix issues
      {
        source: '/:lang(en|sk|cs|ru)/manifest.json',
        destination: '/manifest.json',
      },
      {
        source: '/:lang(en|sk|cs|ru)/favicon.ico',
        destination: '/favicon.ico',
      },
      {
        source: '/:lang(en|sk|cs|ru)/logo.png',
        destination: '/logo.png',
      },
      // Auth rewrites - cleaner URLs
      {
        source: '/:lang(en|sk|cs|ru)/login',
        destination: '/:lang/auth/login',
      },
      {
        source: '/:lang(en|sk|cs|ru)/register',
        destination: '/:lang/auth/register',
      },
    ]
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Base redirects to default locale (en)
      {
        source: '/login',
        destination: '/en/login',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/en/register',
        permanent: true,
      },
      {
        source: '/admin/:path*',
        destination: '/en/admin/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/:path*',
        destination: '/en/dashboard/:path*',
        permanent: true,
      },
      {
        source: '/messages/:path*',
        destination: '/en/messages/:path*',
        permanent: true,
      },
      {
        source: '/favorites/:path*',
        destination: '/en/favorites/:path*',
        permanent: true,
      },
      {
        source: '/post',
        destination: '/en/post',
        permanent: true,
      },

      // Profile to Dashboard unification
      {
        source: '/profile',
        destination: '/en/dashboard',
        permanent: true,
      },
      {
        source: '/:lang(en|sk|cs|ru)/profile',
        destination: '/:lang/dashboard',
        permanent: true,
      },
      {
        source: '/:lang(en|sk|cs|ru)/profile/:path*',
        destination: '/:lang/dashboard/:path*',
        permanent: true,
      },
      {
        source: '/profile/:path*',
        destination: '/en/dashboard/:path*',
        permanent: true,
      },

      // Navigation cleanup (top-level routing)
      {
        source: '/:lang(en|sk|cs|ru)/dashboard/messages/:path*',
        destination: '/:lang/messages/:path*',
        permanent: true,
      },
      {
        source: '/:lang(en|sk|cs|ru)/dashboard/favorites/:path*',
        destination: '/:lang/favorites/:path*',
        permanent: true,
      },

      // Legacy paths
      {
        source: '/:lang(en|sk|cs|ru)/create-ad',
        destination: '/:lang/post',
        permanent: true,
      },
      {
        source: '/create-ad',
        destination: '/en/post',
        permanent: true,
      },
      {
        source: '/:lang(en|sk|cs|ru)/dashboard/purchases/:path*',
        destination: '/:lang/dashboard/orders/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/purchases/:path*',
        destination: '/en/dashboard/orders/:path*',
        permanent: true,
      },
      // Dashboard profile cleanup - REMOVED redundant redirects to allow /dashboard/profile preview
    ]
  },

  // Compression
  compress: true,

  // Power by header (security)
  poweredByHeader: false,

  // React strict mode for better development
  reactStrictMode: true,

  // Enable source maps in production for debugging
  productionBrowserSourceMaps: false,
}

export default nextConfig
