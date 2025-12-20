#!/usr/bin/env node
// Database Migration Helper
// Shows instructions for running migrations via Supabase Dashboard

const fs = require('fs')
const path = require('path')

console.log('\n🗃️  Database Migrations\n')

const migrationsPath = path.join(process.cwd(), 'database', 'migrations')

if (!fs.existsSync(migrationsPath)) {
  console.log('⚠️  No migrations folder found')
  process.exit(0)
}

const migrations = fs.readdirSync(migrationsPath)
  .filter(f => f.endsWith('.sql'))
  .sort()

if (migrations.length === 0) {
  console.log('⚠️  No migration files found')
  process.exit(0)
}

console.log(`📝 Found ${migrations.length} migration file(s):\n`)

migrations.forEach((m, i) => {
  console.log(`   ${i + 1}. ${m}`)
})

console.log('\n📋 How to run migrations:\n')
console.log('1. Open Supabase Dashboard → SQL Editor')
console.log('2. For each migration file:')
console.log('   - Open: database/migrations/<filename>.sql')
console.log('   - Copy content')
console.log('   - Paste in SQL Editor')
console.log('   - Click "Run"')
console.log('\n💡 Run migrations in order (001, 002, 003, etc.)')
console.log('\n✅ That\'s it!\n')
