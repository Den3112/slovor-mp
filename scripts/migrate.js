#!/usr/bin/env node
// Run database migrations

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.log('\nRequired variables:')
  console.log('  - NEXT_PUBLIC_SUPABASE_URL')
  console.log('  - SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigrations() {
  console.log('\n🗃️  Running Database Migrations\n')
  
  const migrationsPath = path.join(process.cwd(), 'database', 'migrations')
  
  if (!fs.existsSync(migrationsPath)) {
    console.log('⚠️  No migrations folder found')
    return
  }
  
  const migrations = fs.readdirSync(migrationsPath)
    .filter(f => f.endsWith('.sql'))
    .sort()
  
  if (migrations.length === 0) {
    console.log('⚠️  No migration files found')
    return
  }
  
  console.log(`Found ${migrations.length} migration(s):\n`)
  
  for (const migration of migrations) {
    console.log(`📝 Running: ${migration}`)
    
    const sql = fs.readFileSync(
      path.join(migrationsPath, migration),
      'utf8'
    )
    
    try {
      const { error } = await supabase.rpc('exec_sql', { sql })
      
      if (error) {
        console.log(`   ❌ Error: ${error.message}`)
        console.log('\n💡 Try running this migration manually in Supabase Dashboard → SQL Editor')
      } else {
        console.log(`   ✅ Success`)
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`)
      console.log('\n💡 Manual execution required:')
      console.log('   1. Open Supabase Dashboard → SQL Editor')
      console.log(`   2. Copy content from: database/migrations/${migration}`)
      console.log('   3. Paste and run in SQL Editor')
    }
  }
  
  console.log('\n✅ Migration process complete!\n')
}

runMigrations().catch(err => {
  console.error('❌ Migration failed:', err.message)
  process.exit(1)
})
