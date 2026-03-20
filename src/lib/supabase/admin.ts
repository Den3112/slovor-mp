import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import { serverEnv } from '@/lib/env.server'

/**
 * Creates a Supabase Admin client with Service Role Key.
 * Uses lazy initialization to avoid module-level singleton leak.
 * MUST only be called from Server Actions / API Routes.
 */
export function createAdminClient(): SupabaseClient {
  const supabaseUrl = env.SUPABASE_URL
  const supabaseServiceRoleKey = serverEnv.SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL'
    )
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
