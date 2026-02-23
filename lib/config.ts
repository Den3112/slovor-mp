// Application configuration
// Centralized config following Principle #3 (One owner)

import { env } from '@/lib/env'

export const config = {
  // Environment detection
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isPreview: process.env.VERCEL_ENV === 'preview',

  // Supabase
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
  },

  // Feature flags
  features: {
    enableDebugLogs: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },

  // API configuration
  api: {
    rateLimit: parseInt(process.env.NEXT_PUBLIC_API_RATE_LIMIT || '100'),
  },

  // App metadata
  app: {
    name: 'Slovor Marketplace',
    version: '1.0.0',
    url: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000',
    adminEmails: [
      'admin@slovor.sk',
      'moderator@slovor.sk',
      'test.seller@slovor.sk',
    ],
  },
}

// Helper functions
export const isDev = () => config.isDevelopment
export const isProd = () => config.isProduction
export const isPreview = () => config.isPreview

// Debug logger (only works in development)
export const debugLog = (...args: unknown[]) => {
  if (config.features.enableDebugLogs) {
    console.log('[DEBUG]', ...args)
  }
}
