import type { NextConfig } from 'next'

// Validate environment variables at build-time
import './src/lib/env.ts'

const nextConfig: NextConfig = {
  output: 'standalone',

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },

  images: {
    // Allow external image domains (production only)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'hnkhwvhjwygolvwvxnor.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
      },
    ],
    // SVG support disabled for security (XSS vector)
    dangerouslyAllowSVG: false,
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
        source: '/:lang(en|sk|cs)/manifest.json',
        destination: '/manifest.json',
      },
      {
        source: '/:lang(en|sk|cs)/favicon.ico',
        destination: '/favicon.ico',
      },
      {
        source: '/:lang(en|sk|cs)/logo.png',
        destination: '/logo.png',
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
          /* {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          }, */
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
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
        source: '/:lang(en|sk|cs)/profile',
        destination: '/:lang/dashboard',
        permanent: true,
      },
      {
        source: '/:lang(en|sk|cs)/profile/:path*',
        destination: '/:lang/dashboard/:path*',
        permanent: true,
      },
      // Redirects handled in middleware

      // Legacy paths
      {
        source: '/:lang(en|sk|cs)/create-ad',
        destination: '/:lang/post',
        permanent: true,
      },
      // Redirects handled in middleware

      {
        source: '/:lang(en|sk|cs)/dashboard/purchases/:path*',
        destination: '/:lang/dashboard/orders/:path*',
        permanent: true,
      },
      // Redirects handled in middleware

      // Dashboard profile cleanup - REMOVED redundant redirects to allow /dashboard/profile preview

      // [P3-01] Redirect /test in production
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/:lang(en|sk|cs)/test',
              destination: '/:lang',
              permanent: false,
            },
          ]
        : []),
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

// const withPWA = ... - Removed for stability
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(nextConfig)
