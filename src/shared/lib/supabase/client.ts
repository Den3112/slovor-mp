import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/shared/lib/env'

const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseUrl.startsWith('https://')) {
  console.error('CRITICAL: Supabase URL is missing or invalid:', supabaseUrl)
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
