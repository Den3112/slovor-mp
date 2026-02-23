import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testConnection() {
  console.log('Testing Supabase Connection...')
  console.log('URL:', supabaseUrl)
  console.log('Anon Key (first 10):', supabaseAnonKey?.substring(0, 10))

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing environment variables')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Attempt a simple query
    const { data, error } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true })

    if (error) {
      console.error('❌ Supabase Error:', error.message)
      if (error.message.includes('API key')) {
        console.error(
          '🚨 INDEED: The API key is invalid or for a different project.'
        )
      }
    } else {
      console.log('✅ Success! Found categories count:', data)
    }
  } catch (err) {
    console.error('❌ Unexpected Error:', err)
  }
}

testConnection()
