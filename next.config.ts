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
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
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
      {
        source: '/:lang(en|sk|cs|ru)/login',
        destination: '/:lang/auth/login',
      },
      {
        source: '/:lang(en|sk|cs|ru)/register',
        destination: '/:lang/auth/register',
      },
      {
        source: '/login',
        destination: '/auth/login',
      },
      {
        source: '/register',
        destination: '/auth/register',
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
      {
        source: '/profile/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
      },
      {
        source: '/:lang/profile/:path*',
        destination: '/:lang/dashboard/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/messages/:path*',
        destination: '/messages/:path*',
        permanent: true,
      },
      {
        source: '/:lang/dashboard/messages/:path*',
        destination: '/:lang/messages/:path*',
        permanent: true,
      },
      {
        source: '/dashboard/favorites/:path*',
        destination: '/favorites/:path*',
        permanent: true,
      },
      {
        source: '/:lang/dashboard/favorites/:path*',
        destination: '/:lang/favorites/:path*',
        permanent: true,
      },
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
