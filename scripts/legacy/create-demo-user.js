require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function createDemoUser() {
  const email = 'demo@slovor.com'
  const password = 'password123'

  console.log(`Ensuring user ${email}...`)

  // 1. Check/Create Auth User
  let userId
  const {
    data: { users },
  } = await supabase.auth.admin.listUsers()
  const existingUser = users.find((u) => u.email === email)

  if (existingUser) {
    console.log('Auth user already exists.')
    userId = existingUser.id
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: 'Demo User' },
    })
    if (error) {
      console.error('Error creating auth user:', error.message)
      return
    }
    userId = data.user.id
    console.log('Auth user created.')
  }

  // 2. Check/Create Public Profile
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (!profile) {
    console.log('Creating public profile...')
    const { error: profileError } = await supabase.from('users').insert({
      id: userId,
      username: 'demo_user',
      full_name: 'Demo User',
      verified: true,
    })

    if (profileError)
      console.error('Error creating profile:', profileError.message)
    else console.log('✅ Public profile created!')
  } else {
    console.log('✅ Public profile already exists.')
  }
}

createDemoUser()
