/**
 * Environment Variables Access
 *
 * WHY THIS FILE EXISTS:
 * - Provides type-safe access to env variables
 * - Single source of truth for env vars
 *
 * NOTE: In Next.js, NEXT_PUBLIC_ variables are inlined at build time.
 * We access them directly without runtime validation to avoid errors.
 */

// Direct access to public env vars (these are inlined by Next.js at build time)
export const env = {
  // Supabase - REQUIRED (accessed directly, no runtime validation)
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // App Config - OPTIONAL
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Feature Flags - OPTIONAL (for future use)
  ENABLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true',
  ENABLE_PAYMENTS: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
} as const

/**
 * Type-safe environment variable access
 * TypeScript will autocomplete available env vars
 */
export type Env = typeof env
