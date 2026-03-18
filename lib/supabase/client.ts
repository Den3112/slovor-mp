import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

const supabaseUrl = env.SUPABASE_URL || 'https://mock.supabase.co'
const supabaseAnonKey = env.SUPABASE_ANON_KEY || 'mock'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
