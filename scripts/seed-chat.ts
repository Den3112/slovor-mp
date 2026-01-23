import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY // Use service role if possible, but anon might work if RLS allows or we use service role key
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || (!supabaseKey && !serviceRoleKey)) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

// Prefer service role for seeding to bypass RLS
const supabase = createClient(supabaseUrl, serviceRoleKey || supabaseKey!)

async function seedChats() {
  console.log('🌱 Seeding demo chats...')

  // 1. Get all users
  const { data: users, error: usersError } = await supabase
    .from('profiles')
    .select('id, display_name')
  if (usersError || !users?.length) {
    console.error('Error fetching users or no users found:', usersError)
    return
  }

  console.log(`Found ${users.length} users.`)

  // 2. Get some listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('id, title, user_id')
    .limit(10)
  if (listingsError || !listings?.length) {
    console.error('Error fetching listings:', listingsError)
    return
  }

  // 3. For each user, ensure they have a chat
  for (const user of users) {
    // Find a listing they don't own
    const targetListing = listings.find((l) => l.user_id !== user.id)

    if (!targetListing) {
      console.log(
        `Skipping user ${user.display_name} (only owns listings or no others available)`
      )
      continue
    }

    console.log(
      `Creating chat for ${user.display_name} regarding "${targetListing.title}"`
    )

    // Check if conversation exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('listing_id', targetListing.id)
      .eq('buyer_id', user.id)
      .eq('seller_id', targetListing.user_id)
      .maybeSingle()

    let conversationId = existing?.id

    if (!conversationId) {
      const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert({
          listing_id: targetListing.id,
          buyer_id: user.id,
          seller_id: targetListing.user_id,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (createError) {
        console.error('Failed to create conversation:', createError)
        continue
      }
      conversationId = newConv.id
    }

    // Insert demo messages
    const messages = [
      {
        conversation_id: conversationId,
        sender_id: user.id, // Buyer asks
        content: `Hi, is this ${targetListing.title} still available?`,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        is_read: true,
      },
      {
        conversation_id: conversationId,
        sender_id: targetListing.user_id, // Seller replies
        content: 'Yes, it is! When would you like to see it?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(), // 1.5 hours ago
        is_read: true,
      },
      {
        conversation_id: conversationId,
        sender_id: user.id, // Buyer replies
        content: 'Can we meet tomorrow evening?',
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
        is_read: false, // Unread
      },
    ]

    for (const msg of messages) {
      await supabase.from('messages').insert(msg)
    }
  }

  console.log('✅ Demo chats created successfully!')
}

seedChats()
