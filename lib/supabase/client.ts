// Supabase client configuration
// Explicit initialization, no magic (Principle #4)

import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

/**
 * Supabase Client Configuration
 *
 * USAGE:
 * ```typescript
 * import { supabase } from '@/lib/supabase/client'
 * const { data, error } = await supabase.from('listings').select()
 * ```
 *
 * CONFIGURATION:
 * - env.SUPABASE_URL: Your Supabase project URL
 * - env.SUPABASE_ANON_KEY: Public anon key (safe for client-side)
 *
 * SECURITY:
 * - Anon key is safe to expose (protected by RLS policies)
 * - Never use service_role key on client side
 * - All data access controlled by Row Level Security
 */
const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

const createSupabaseClient = () => createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

declare global {
  // eslint-disable-next-line no-var
  var supabase: ReturnType<typeof createSupabaseClient> | undefined
}

export const supabase = globalThis.supabase ?? createSupabaseClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.supabase = supabase
}

