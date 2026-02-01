
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://hnkhwvhjwygolvwvxnor.supabase.co'
const supabaseServiceKey = process.argv[2] || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseServiceKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is required')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setAdmin() {
    const email = 'admin@slovor.sk'
    console.log(`Searching for user: ${email}`)

    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    if (authError) {
        console.error('Error fetching users:', authError)
        return
    }

    const user = users.find(u => u.email === email)
    if (!user) {
        console.log(`User ${email} not found. Creation might be needed or check email.`)
        // If not found, list first 5 users to see what's there
        console.log('Available users:', users.slice(0, 5).map(u => u.email))
        return
    }

    console.log('User found:', user.id)
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)

    if (profileError) {
        console.error('Error updating profile role:', profileError)
    } else {
        console.log('Successfully set admin role for user!')
    }
}

setAdmin()
