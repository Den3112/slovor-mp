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
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  {
    auth: {
      // Keep user session in browser
      persistSession: true,
      // Auto-refresh tokens before expiry
      autoRefreshToken: true,
      // Detect session from URL params (for email confirmations)
      detectSessionInUrl: true,
    },
  }
)
