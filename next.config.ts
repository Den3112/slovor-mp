import type { NextConfig } from 'next'

// Validate environment variables at build-time
import './lib/env.ts'

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
    // Server Actions limitations for security
    serverActions: {
      bodySizeLimit: '2mb',
    },
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://*.supabase.co https://images.unsplash.com https://picsum.photos https://loremflickr.com https://api.dicebear.com https://res.cloudinary.com; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://open.er-api.com https://vitals.vercel-insights.com; frame-ancestors 'none'; upgrade-insecure-requests;",
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Removed hardcoded locale redirects to handle them dynamically in middleware

      // Profile to Dashboard unification
      // Redirects handled in middleware

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
      // Redirects handled in middleware

      // Legacy paths
      {
        source: '/:lang(en|sk|cs|ru)/create-ad',
        destination: '/:lang/post',
        permanent: true,
      },
      // Redirects handled in middleware

      {
        source: '/:lang(en|sk|cs|ru)/dashboard/purchases/:path*',
        destination: '/:lang/dashboard/orders/:path*',
        permanent: true,
      },
      // Redirects handled in middleware

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

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
