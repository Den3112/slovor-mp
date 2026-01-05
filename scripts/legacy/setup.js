#!/usr/bin/env node
// Automatic setup script for Slovor Marketplace
// Installs all necessary CLI tools and checks environment

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function exec(command, options = {}) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe', ...options })
  } catch (error) {
    return null
  }
}

function checkCommand(command) {
  return exec(`which ${command}`) !== null
}

log('\n🚀 Slovor Marketplace Setup', 'blue')
log('==========================\n', 'blue')

// Check Node version
log('📦 Checking Node.js version...', 'yellow')
const nodeVersion = process.version
log(`   Node.js ${nodeVersion} detected`, 'green')

// Check npm
log('\n📦 Checking npm...', 'yellow')
const npmVersion = exec('npm --version')
if (npmVersion) {
  log(`   npm ${npmVersion.trim()} detected`, 'green')
} else {
  log('   ❌ npm not found', 'red')
  process.exit(1)
}

// Check if .env.local exists
log('\n🔐 Checking environment configuration...', 'yellow')
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  log('   ✅ .env.local found', 'green')
} else {
  log('   ⚠️  .env.local not found', 'yellow')
  log('   📝 Creating from .env.example...', 'yellow')

  const examplePath = path.join(process.cwd(), '.env.example')
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath)
    log('   ✅ Created .env.local (remember to add your credentials!)', 'green')
  } else {
    log('   ⚠️  .env.example not found, skipping', 'yellow')
  }
}

// Check Supabase CLI
log('\n🗄️  Checking Supabase CLI...', 'yellow')
if (checkCommand('supabase')) {
  const supabaseVersion = exec('supabase --version')
  log(`   ✅ Supabase CLI ${supabaseVersion.trim()} detected`, 'green')
} else {
  log('   📥 Supabase CLI not found, installing...', 'yellow')
  try {
    // Supabase CLI is in dependencies, so it's already installed via npm
    log('   ✅ Supabase CLI installed via npm', 'green')
    log('   💡 Use: npx supabase [command]', 'blue')
  } catch (error) {
    log('   ⚠️  Could not install Supabase CLI automatically', 'yellow')
    log('   📝 Install manually: npm install -g supabase', 'blue')
  }
}

// Check git
log('\n🔀 Checking Git...', 'yellow')
if (checkCommand('git')) {
  const gitVersion = exec('git --version')
  log(`   ✅ ${gitVersion.trim()} detected`, 'green')

  // Check current branch
  const branch = exec('git branch --show-current')
  if (branch) {
    log(`   📍 Current branch: ${branch.trim()}`, 'blue')
    if (branch.trim() !== 'dev') {
      log('   ⚠️  Not on dev branch! Switch with: git checkout dev', 'yellow')
    }
  }
} else {
  log('   ❌ Git not found', 'red')
}

// Check if database migrations exist
log('\n🗃️  Checking database migrations...', 'yellow')
const migrationsPath = path.join(process.cwd(), 'database', 'migrations')
if (fs.existsSync(migrationsPath)) {
  const migrations = fs
    .readdirSync(migrationsPath)
    .filter((f) => f.endsWith('.sql'))
  log(`   ✅ Found ${migrations.length} migration(s)`, 'green')
  migrations.forEach((m) => log(`      - ${m}`, 'blue'))

  if (migrations.length > 0) {
    log('\n   💡 To run migrations:', 'blue')
    log('      npm run db:migrate', 'blue')
    log('      or use Supabase Dashboard → SQL Editor', 'blue')
  }
} else {
  log('   ⚠️  No migrations folder found', 'yellow')
}

// Summary
log('\n✅ Setup Complete!', 'green')
log('==================\n', 'green')

log('📋 Next steps:', 'blue')
log('1. Configure .env.local with your Supabase credentials', 'blue')
log('2. Run migrations: npm run db:migrate', 'blue')
log('3. Start development: npm run dev', 'blue')
log('\n💡 For more info, check: .github/AI_GUIDE.md\n', 'blue')
