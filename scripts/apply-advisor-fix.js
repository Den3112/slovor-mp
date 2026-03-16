const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') })

async function applyAdvisorFix() {
  const sqlPath = path.join(
    __dirname,
    '../supabase/migrations/20260305100000_advisor_ultimate_fix_v4.sql'
  )
  const sql = fs.readFileSync(sqlPath, 'utf8')

  const token =
    process.env.SUPABASE_ACCESS_TOKEN || process.env.SUPABASE_SERVICE_ROLE_KEY
  const projectRef = 'hnkhwvhjwygolvwvxnor'

  console.log('--- Applying Advisor Ultimate Fix ---')
  console.log(`Project: ${projectRef}`)

  if (!token) {
    console.error(
      'Error: Please set SUPABASE_ACCESS_TOKEN or SUPABASE_SERVICE_ROLE_KEY environment variable.'
    )
    process.exit(1)
  }

  try {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sql }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(
        `Cloud API Error: ${error.message || response.statusText}`
      )
    }

    const result = await response.json()
    console.log('Success! SQL migration applied successfully.')
    console.log('Result:', result)
    console.log(
      '\nNow go to Supabase Dashboard -> Performance Advisor and click "Refresh".'
    )
  } catch (err) {
    console.error('Failed to apply migration:', err.message)
    console.log(
      '\nAlternative: Open the SQL file manually in Supabase Dashboard SQL Editor:'
    )
    console.log(sqlPath)
  }
}

applyAdvisorFix()
