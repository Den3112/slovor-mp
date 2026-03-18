import { z } from 'zod'

/**
 * Environment Variables Schema
 *
 * WHY THIS USES ZOD:
 * - Direct validation of required variables
 * - Type-safety across the entire app
 * - Prevents startup if critical keys are missing
 */

const envSchema = z.object({
  // Supabase - Required
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // App Config - Optional with defaults
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  ADMIN_EMAILS: z.string().optional().default('admin@slovor.sk'),
})

// Validate all environment variables
const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  ADMIN_EMAILS: process.env.ADMIN_EMAILS,
}

const parsed = envSchema.safeParse(processEnv)

if (!parsed.success) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '❌ Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    )
  }
}

const envData = parsed.success ? parsed.data : (processEnv as any)

/**
 * Centralized Environment Object
 */
export const env = {
  // Supabase
  SUPABASE_URL: envData.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: envData.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',

  // App
  NODE_ENV: envData.NODE_ENV || 'development',
  APP_URL: envData.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

  // Admin
  ADMIN_EMAILS: (envData.ADMIN_EMAILS || 'admin@slovor.sk').split(',').map((email: string) => email.trim()),

  // Legacy aliases (if any)
  isDev: (envData.NODE_ENV || process.env.NODE_ENV) === 'development',
  isProd: (envData.NODE_ENV || process.env.NODE_ENV) === 'production',
} as const

export type Env = typeof env
