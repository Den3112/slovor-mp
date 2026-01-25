require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkIcons() {
  const { data: categories, error } = await supabase
    .from('categories')
    .select('name, slug, icon')

  if (error) {
    console.error('Error fetching categories:', error)
    return
  }

  console.log('Category Icons Check:')
  categories.forEach((cat) => {
    console.log(
      `- ${cat.name} (${cat.slug}): [${cat.icon}] (Type: ${typeof cat.icon})`
    )
  })
}

checkIcons()
