#!/usr/bin/env node
// Database Seed Helper
// Shows instructions for seeding data via Supabase Dashboard

const fs = require('fs')
const path = require('path')

console.log('\n🌱 Database Seeds\n')

const seedsPath = path.join(process.cwd(), 'database', 'seeds')

if (!fs.existsSync(seedsPath)) {
  console.log('⚠️  No seeds folder found')
  process.exit(0)
}

const seeds = fs.readdirSync(seedsPath)
  .filter(f => f.endsWith('.sql'))
  .sort()

if (seeds.length === 0) {
  console.log('⚠️  No seed files found')
  process.exit(0)
}

console.log(`📝 Found ${seeds.length} seed file(s):\n`)

seeds.forEach((s, i) => {
  console.log(`   ${i + 1}. ${s}`)
})

console.log('\n⚠️  WARNING: Seeds will TRUNCATE (delete) existing data!\n')
console.log('📋 How to run seeds (LOCAL/DEV ONLY!):\n')
console.log('1. Open Supabase Dashboard → SQL Editor')
console.log('2. For each seed file:')
console.log('   - Open: database/seeds/<filename>.sql')
console.log('   - Copy content')
console.log('   - Paste in SQL Editor')
console.log('   - Click "Run"')
console.log('\n🚨 NEVER run seeds in production!\n')
console.log('💡 Seeds are for testing and local development only\n')
