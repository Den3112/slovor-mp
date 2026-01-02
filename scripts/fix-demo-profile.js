require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function fixDemoUser() {
  const email = 'demo@slovor.com'
  console.log(`Fixing profile for ${email}...`)

  // 1. Get Auth User
  const {
    data: { users },
    error: listError,
  } = await supabase.auth.admin.listUsers()
  const user = users.find((u) => u.email === email)

  if (!user) {
    console.error(
      'Demo user not found in Auth! Please run creation script first or check errors.'
    )
    return
  }

  console.log(`Found Auth User ID: ${user.id}`)

  // 2. Check Public Profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile) {
    console.log('Profile already exists:', profile)
    return
  }

  // 3. Create Public Profile
  console.log('Profile missing. Creating...')
  const { error: insertError } = await supabase.from('users').insert({
    id: user.id,
    username: 'demo_user',
    full_name: 'Demo User',
    verified: true,
  })

  if (insertError) {
    console.error('Error creating profile:', insertError.message)
  } else {
    console.log('✅ Public profile created successfully!')
  }
}

fixDemoUser()
