'use client'

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import { env } from '@/shared/lib/env'

let browserServiceRole: ReturnType<typeof createSupabaseBrowserClient> | null = null

/**
 * Singleton client for browser use with lazy initialization
 */
export function getBrowserClient() {
  if (browserServiceRole) return browserServiceRole

  const supabaseUrl = env.SUPABASE_URL
  const supabaseAnonKey = env.SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    if (typeof window !== 'undefined') {
      console.warn('Supabase URL is missing')
    }
  }

  browserServiceRole = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  return browserServiceRole
}

/**
 * Legacy compatibility factory
 */
export function createClient() {
  return getBrowserClient()
}

/**
 * Singleton client for browser/client-side use.
 * Safe to import anywhere, but will use environment variables from the browser context.
 */
export const supabase = getBrowserClient()
