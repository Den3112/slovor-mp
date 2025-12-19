#!/usr/bin/env node
// Check all required CLI tools

const { execSync } = require('child_process')

const tools = [
  { name: 'Node.js', command: 'node --version', required: true },
  { name: 'npm', command: 'npm --version', required: true },
  { name: 'Git', command: 'git --version', required: true },
  { name: 'Supabase CLI', command: 'npx supabase --version', required: false },
]

function checkTool(tool) {
  try {
    const version = execSync(tool.command, { encoding: 'utf8', stdio: 'pipe' })
    console.log(`✅ ${tool.name}: ${version.trim()}`)
    return true
  } catch (error) {
    console.log(`${tool.required ? '❌' : '⚠️'} ${tool.name}: Not found`)
    return false
  }
}

console.log('\n🔍 Checking CLI Tools\n')

let allOk = true
tools.forEach(tool => {
  const ok = checkTool(tool)
  if (tool.required && !ok) allOk = false
})

if (allOk) {
  console.log('\n✅ All required tools are installed!\n')
} else {
  console.log('\n❌ Some required tools are missing!\n')
  process.exit(1)
}
