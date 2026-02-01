
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error('Error: Missing environment variables for Supabase.')
    process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

async function checkUser() {
    console.log('Checking recent users...')
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    if (error) {
        console.error('Error fetching users:', error)
        return
    }

    // Find users created in the last 10 minutes
    const recentUsers = users.filter(u => {
        const created = new Date(u.created_at).getTime()
        const now = Date.now()
        return (now - created) < 10 * 60 * 1000
    })

    console.log('Recent users found:', recentUsers.length)
    recentUsers.forEach(u => console.log(`- ${u.email} (${u.id})`))
}

checkUser()
