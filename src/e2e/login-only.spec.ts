import { test, expect } from '@playwright/test'
import { createClient } from './utils/supabase-admin'

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000'
const TEST_EMAIL = 'test.seller@slovor.sk'
const TEST_PASSWORD = 'password'

test.describe('Login Only Debug', () => {
  test.beforeAll(async () => {
    // Ensure user exists and has password
    const supabase = createClient()
    const {
      data: { users },
    } = await supabase.auth.admin.listUsers()
    const user = users.find((u) => u.email === TEST_EMAIL)
    if (user) {
      console.log(`Setting password to "${TEST_PASSWORD}" for ${TEST_EMAIL}...`)
      await supabase.auth.admin.updateUserById(user.id, {
        password: TEST_PASSWORD,
      })
      // Ensure admin role
      await supabase
        .from('profiles')
        .upsert({ id: user.id, role: 'admin' }, { onConflict: 'id' })
    } else {
      console.log(`Test user ${TEST_EMAIL} not found! Creating...`)
      const {
        data: { user: newUser },
      } = await supabase.auth.admin.createUser({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
        email_confirm: true,
        user_metadata: { role: 'admin' },
      })
      if (newUser) {
        await supabase
          .from('profiles')
          .upsert({ id: newUser.id, role: 'admin' }, { onConflict: 'id' })
      }
    }
  })

  test('Simple Login Attempt', async ({ page }) => {
    console.log(`Navigating to ${BASE_URL}/en/auth/login...`)
    await page.goto(`${BASE_URL}/en/auth/login`, { timeout: 90000 })
    await page.waitForLoadState('domcontentloaded')
    console.log(`Current URL: ${page.url()}`)

    await page.screenshot({ path: 'test-results/login-step-init.png' })

    const emailInput = page.getByTestId('auth-email-input')
    const passInput = page.getByTestId('auth-password-input')
    const submitBtn = page.getByTestId('auth-submit-btn')

    await expect(emailInput).toBeVisible({ timeout: 10000 })
    await emailInput.fill(TEST_EMAIL)
    await passInput.fill(TEST_PASSWORD)

    console.log('Clicking sign in button...')
    await page.screenshot({ path: 'test-results/login-step-before-click.png' })
    await submitBtn.click({ force: true })

    console.log('Waiting for URL change to dashboard...')
    await page.waitForURL((url) => url.pathname.includes('/dashboard'), {
      timeout: 120000,
    })
    console.log(`Success! Current URL: ${page.url()}`)
    await page.screenshot({ path: 'test-results/login-step-success.png' })
  })
})
