/**
 * Environment Variables Validation
 * 
 * WHY THIS FILE EXISTS:
 * - Validates env vars at startup (fail fast)
 * - Provides type-safe access to env variables
 * - Clear error messages for missing configuration
 * - Single source of truth for env vars
 * 
 * HOW TO USE:
 * ```typescript
 * import { env } from '@/lib/env'
 * const client = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
 * ```
 * 
 * ADDING NEW ENV VAR:
 * 1. Add to .env.example
 * 2. Add validation here
 * 3. Add to env object export
 */

function getEnvVar(key: string, isPublic = false): string {
  const envKey = isPublic ? `NEXT_PUBLIC_${key}` : key
  const value = process.env[envKey]

  if (!value) {
    throw new Error(
      `Missing environment variable: ${envKey}\n\n` +
      `Please add it to your .env.local file:\n` +
      `${envKey}=your_value_here\n\n` +
      `See .env.example for reference.`
    )
  }

  return value
}

function getOptionalEnvVar(key: string, defaultValue: string, isPublic = false): string {
  const envKey = isPublic ? `NEXT_PUBLIC_${key}` : key
  return process.env[envKey] || defaultValue
}

/**
 * Validated environment variables
 * All required vars are validated at import time
 */
export const env = {
  // Supabase - REQUIRED
  SUPABASE_URL: getEnvVar('SUPABASE_URL', true),
  SUPABASE_ANON_KEY: getEnvVar('SUPABASE_ANON_KEY', true),
  
  // App Config - OPTIONAL
  NODE_ENV: getOptionalEnvVar('NODE_ENV', 'development'),
  APP_URL: getOptionalEnvVar('NEXT_PUBLIC_APP_URL', 'http://localhost:3000', true),
  
  // Feature Flags - OPTIONAL (for future use)
  ENABLE_AUTH: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_AUTH', 'false', true) === 'true',
  ENABLE_PAYMENTS: getOptionalEnvVar('NEXT_PUBLIC_ENABLE_PAYMENTS', 'false', true) === 'true',
} as const

/**
 * Type-safe environment variable access
 * TypeScript will autocomplete available env vars
 */
export type Env = typeof env
