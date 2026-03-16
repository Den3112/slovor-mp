const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixTesla() {
  const { data, error } = await supabase
    .from('listings')
    .update({
      images: [
        'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop',
      ],
    })
    .ilike('title', '%Tesla Model 3%')

  if (error) console.error('Error:', error)
  else console.log('Successfully fixed Tesla image')
}

fixTesla()
