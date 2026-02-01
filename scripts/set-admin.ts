
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hnkhwvhjwygolvwvxnor.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

async function setAdmin() {
    const email = 'admin@slovor.sk'

    // 1. Get user by email
    const { data: users, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
        console.error('Error fetching users:', authError)
        return
    }

    const user = users.users.find(u => u.email === email)
    if (!user) {
        console.log(`User ${email} not found. Creating it...`)
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
            email,
            password: 'AdminPassword123!', // User should change this
            email_confirm: true,
            user_metadata: { full_name: 'Admin' }
        })

        if (createError) {
            console.error('Error creating user:', createError)
            return
        }

        console.log('User created:', newUser.user.id)
        await updateRole(newUser.user.id)
    } else {
        console.log('User found:', user.id)
        await updateRole(user.id)
    }
}

async function updateRole(userId: string) {
    // 2. Update role in profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', userId)

    if (profileError) {
        console.error('Error updating profile role:', profileError)
    } else {
        console.log('Successfully set admin role for user!')
    }
}

setAdmin()
