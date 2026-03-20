import { chromium, FullConfig } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables manually since globalSetup runs before standard test env setup
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function globalSetup(config: FullConfig) {
  const storageStatePath = path.resolve(
    (config.projects?.[0]?.use?.storageState as string) ||
      'src/e2e/.auth/user.json'
  )
  const dir = path.dirname(storageStatePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage()
  const baseURL = config.projects?.[0]?.use?.baseURL || 'http://localhost:3000'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const testEmail = process.env.TEST_USER_EMAIL || 'test.seller@slovor.sk'

  try {
    console.log(`Global Setup: Authenticating ${testEmail} at ${baseURL}`)

    if (serviceRoleKey && supabaseUrl) {
      console.log(
        'Global Setup: Using Supabase Admin API to bypass rate limits...'
      )
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })

      // Ensure user exists first (idempotent-ish) or generate link directly
      const { data, error } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email: testEmail,
        options: {
          redirectTo: baseURL + '/en/dashboard', // Redirect directly to dashboard
        },
      })

      if (error) {
        console.error(
          'Global Setup: ❌ Failed to generate magic link:',
          error.message
        )
        throw error
      }

      if (data?.properties?.action_link) {
        const linkUrl = new URL(data.properties.action_link)
        const token = linkUrl.searchParams.get('token')
        const tokenHash = linkUrl.searchParams.get('token_hash')
        const type = linkUrl.searchParams.get('type') as any
        const emailOtp = data.properties.email_otp

        let session = null

        // Strategy 1: Verify using token/token_hash from URL
        if (!session && (token || tokenHash)) {
          console.log('Global Setup: Verifying with URL token...')
          const verifyRes = await supabase.auth.verifyOtp({
            email: testEmail,
            token: token || tokenHash || '',
            type: type || 'magiclink',
          })
          if (verifyRes.data?.session) session = verifyRes.data.session
        }

        // Strategy 2: Verify using email_otp from properties
        if (!session && emailOtp) {
          console.log('Global Setup: Verifying with email_otp...')
          const verifyRes = await supabase.auth.verifyOtp({
            email: testEmail,
            token: emailOtp,
            type: 'email',
          })
          if (verifyRes.data?.session) session = verifyRes.data.session
        }

        if (session) {
          console.log('Global Setup: ✅ Session obtained programmatically!')
        } else {
          console.warn(
            'Global Setup: All verification strategies failed. Token might be invalid or expired immediately.'
          )
        }

        // Promote user (unchanged logic)
        let userId = data.user?.id || session?.user?.id
        try {
          if (!userId) {
            // Fallback listing
            const { data: listData } = await supabase.auth.admin.listUsers()
            const foundUser = listData.users.find((u) => u.email === testEmail)
            if (foundUser) userId = foundUser.id
          }
          if (userId) {
            // 1. Update Profile table
            const { error: roleError } = await supabase.from('profiles').upsert(
              {
                id: userId,
                role: 'admin',
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'id' }
            )

            if (roleError)
              console.error(
                'Global Setup: ERR promoting user in profiles:',
                roleError
              )
            else
              console.log(
                `Global Setup: User ${userId} promoted to admin in profiles table.`
              )

            // 2. Update Auth user_metadata (used by frontend for quick role checks)
            const { data: updateData, error: authError } =
              await supabase.auth.admin.updateUserById(userId, {
                user_metadata: { role: 'admin' },
              })

            if (authError)
              console.error(
                'Global Setup: ERR updating user_metadata:',
                authError
              )
            else {
              console.log(
                'Global Setup: user_metadata updated with role: admin'
              )
              if (session && updateData?.user) {
                session.user = updateData.user
              }
            }
          }
        } catch (e) {}

        if (session) {
          // Inject session into Browser Context
          const projectRef = 'hnkhwvhjwygolvwvxnor' // From .env
          const storageKey = `sb-${projectRef}-auth-token`

          // Set both cookie and localStorage to be safe
          // Cookie is critical for Middleware/SSR
          // Construct cookie value (simplified, might need base64 or specific structure)
          // Supabase SSR uses sophisticated serialization.
          // But client side uses localStorage.

          // We'll trust localStorage sync if we navigate to a client page
          await page.addInitScript(
            (params) => {
              window.localStorage.setItem(
                params.key,
                JSON.stringify(params.val)
              )
            },
            { key: storageKey, val: session }
          )

          // Inject cookies BEFORE navigation so middleware sees them
          const sessionStr = JSON.stringify(session)
          console.log(
            'Global Setup: Injecting auth cookies before navigation (raw JSON)...'
          )
          await page.context().addCookies([
            {
              name: `sb-${projectRef}-auth-token`,
              value: sessionStr,
              domain: 'localhost',
              path: '/',
            },
            {
              name: `sb-${projectRef}-auth-token.0`,
              value: sessionStr,
              domain: 'localhost',
              path: '/',
            },
          ])

          // Navigate to dashboard
          console.log('Global Setup: Navigating with injected session...')
          await page.goto(baseURL + '/en/dashboard')
          try {
            await page.waitForURL('**/dashboard', { timeout: 10000 })
            console.log('Global Setup: ✅ Browser on dashboard.')

            await page.waitForTimeout(1000)
            let cookies = await page.context().cookies()
            console.log(
              'Global Setup: Cookies found:',
              cookies.map((c) => c.name)
            )
          } catch (e) {
            console.warn('Global Setup: Navigation/Sync timeout.', e)
          }
        } else {
          // Fallback to navigating link if verification failed
          console.log(
            'Global Setup: Verification failed, trying direct link navigation...'
          )
          await page.goto(data.properties.action_link)
          try {
            await page.waitForURL('**/dashboard', { timeout: 10000 })
          } catch (e) {}
        }
      } else {
        console.warn(
          'Global Setup: ⚠️ No action_link returned. User might not exist or config error.'
        )
      }
    } else {
      console.warn(
        'Global Setup: ⚠️ SUPABASE_SERVICE_ROLE_KEY not found. Falling back to manual form login (Subject to Rate Limits).'
      )
      // Fallback to manual login
      await page.goto(baseURL + '/en/auth/login', { timeout: 300000 })
      if (await page.getByTestId('auth-email-input').isVisible()) {
        await page.getByTestId('auth-email-input').fill(testEmail)
        await page
          .getByTestId('auth-password-input')
          .fill(process.env.TEST_USER_PASSWORD || 'password')
        await page
          .getByTestId('auth-submit-btn')
          .click({ noWaitAfter: true })
          .catch(() => {})
        await page
          .waitForURL('**/dashboard', { timeout: 10000 })
          .catch(() => {})
      }
    }

    // Save state
    await page.context().storageState({ path: storageStatePath })
  } catch (error) {
    console.warn('Global Setup: Error during setup:', error)
  }

  await browser.close()
}

export default globalSetup
