// Check database contents
// Run with: node scripts/db-info.js

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function getDatabaseInfo() {
  console.log('\ud83d\udcca Slovor Marketplace - Database Info')
  console.log('='.repeat(50))
  console.log('')

  try {
    // Get categories count
    const { data: categories, count: catCount } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })

    console.log('\ud83d\udcda CATEGORIES:')
    console.log(`  Total: ${catCount}`)

    if (categories && categories.length > 0) {
      console.log('\n  Top 10:')
      categories.slice(0, 10).forEach((cat, idx) => {
        console.log(`    ${idx + 1}. ${cat.name_en || cat.name} (${cat.slug})`)
      })
      if (categories.length > 10) {
        console.log(`    ... and ${categories.length - 10} more`)
      }
    }
    console.log('')

    // Get listings count
    const { count: listingsCount } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })

    console.log('\ud83d\udcdd LISTINGS:')
    console.log(`  Total: ${listingsCount}`)
    console.log('')

    // Get listings per category
    if (categories && categories.length > 0) {
      console.log('\ud83d\udcca LISTINGS PER CATEGORY:')

      for (const cat of categories.slice(0, 10)) {
        const { count } = await supabase
          .from('listings')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)

        console.log(`  ${cat.name_en || cat.name}: ${count}`)
      }

      if (categories.length > 10) {
        console.log(`  ... and ${categories.length - 10} more categories`)
      }
    }
    console.log('')

    // Get sample listing
    const { data: sampleListing } = await supabase
      .from('listings')
      .select('title, description, price, location, condition')
      .limit(1)
      .single()

    if (sampleListing) {
      console.log('\ud83d\udcdd SAMPLE LISTING:')
      console.log(`  Title: ${sampleListing.title}`)
      console.log(
        `  Description: ${sampleListing.description.substring(0, 100)}...`
      )
      console.log(`  Price: ${sampleListing.price} EUR`)
      console.log(`  Location: ${sampleListing.location}`)
      console.log(`  Condition: ${sampleListing.condition}`)
      console.log('')
    }

    console.log('='.repeat(50))
    console.log('\u2705 Database check complete!')
  } catch (error) {
    console.error('\u274c Error:', error.message)
    console.error(error)
    process.exit(1)
  }
}

getDatabaseInfo()
