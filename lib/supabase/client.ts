import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/lib/env'

const supabaseUrl = env.SUPABASE_URL
const supabaseAnonKey = env.SUPABASE_ANON_KEY

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseAnonKey)
