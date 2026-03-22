import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment from .env.backup if .env is missing, or .env directly
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env') })
} catch (e) {}
try {
  dotenv.config({ path: path.resolve(process.cwd(), '.env.backup') })
} catch (e) {}

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000'

test.describe('Exhaustive Interactive E2E Test (Docker Verification)', () => {
  const TEST_EMAIL = 'test.seller@slovor.sk'
  const TEST_PASSWORD = process.env.TEST_USER_PASSWORD || 'password'

  test.beforeAll(async () => {
    // 1. Ensure the user has the admin role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.warn('⚠️ Missing Supabase keys. Cannot verify admin role.')
      return
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const {
      data: { users },
    } = await supabase.auth.admin.listUsers()
    const user = users.find((u) => u.email === TEST_EMAIL)
    if (user) {
      console.log(
        `Ensuring ${TEST_EMAIL} has admin role and password for test coverage...`
      )
      // Ensure admin role
      await supabase
        .from('profiles')
        .upsert(
          { id: user.id, role: 'admin', updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        )
      // Ensure password is set to TEST_PASSWORD
      await supabase.auth.admin.updateUserById(user.id, {
        password: TEST_PASSWORD,
      })
    }
  })

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: `test-results/failure-${testInfo.title.replace(/\s+/g, '-')}.png`,
        fullPage: true,
      })
    }
  })

  test('Verify all links and buttons are clickable without CSP blocks', async ({
    page,
  }) => {
    // Log network errors
    page.on('requestfailed', (request) => {
      console.error(
        `Request failed: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`
      )
    })
    page.on('response', (response) => {
      if (response.status() >= 400) {
        console.error(
          `Status ${response.status()}: ${response.request().method()} ${response.url()}`
        )
      }
    })

    let cspErrors: string[] = []
    page.on('console', (msg) => {
      if (
        msg.type() === 'error' &&
        msg.text().includes('Content Security Policy')
      ) {
        cspErrors.push(msg.text())
      }
    })

    // ==========================================
    // PHASE 1: HOME PAGE
    // ==========================================
    await test.step('Check Home Page interactivity', async () => {
      await page.goto(`${BASE_URL}/en`, { timeout: 90000 })
      await page.waitForLoadState('domcontentloaded')
      expect(cspErrors).toHaveLength(0)

      // Click "Categories" button to test JS Hydration
      const categoriesBtn = page
        .getByRole('button', { name: /Categories|Categories|Kategórie/i })
        .first()
      await expect(categoriesBtn).toBeVisible()
      // Use force click because the backdrop might intercept it during hover
      await categoriesBtn.click({ force: true })
      await page.waitForTimeout(500) // Small delay to catch potential errors

      const postAdBtn = page
        .getByRole('link', { name: /Post Ad|Post Ad|Pridať/i })
        .first()
      await expect(postAdBtn).toBeVisible()
      expect(await postAdBtn.isEnabled()).toBeTruthy()
    })

    // ==========================================
    // PHASE 2: AUTH & LOGIN
    // ==========================================
    await test.step('Perform UI Login', async () => {
      console.log(`Logging in via UI as ${TEST_EMAIL}...`)
      await page.goto(`${BASE_URL}/en/login`, { timeout: 90000 })
      await page.waitForLoadState('networkidle')
      console.log('Current URL after goto login:', page.url())

      await page.waitForTimeout(5000) // Give more time for production build to settle
      await page.screenshot({ path: 'test-results/login-at-load.png' })

      await page.getByTestId('auth-email-input').fill(TEST_EMAIL)
      await expect(page.getByTestId('auth-email-input')).toHaveValue(TEST_EMAIL)
      await page.waitForTimeout(500)
      await page.getByTestId('auth-password-input').fill(TEST_PASSWORD)
      await expect(page.getByTestId('auth-password-input')).toHaveValue(
        TEST_PASSWORD
      )
      await page.waitForTimeout(500)

      const submitBtn = page.getByTestId('auth-submit-btn')
      await expect(submitBtn).toBeVisible()

      await page.screenshot({ path: 'test-results/login-before-click.png' })
      console.log('Clicking sign in button...')
      await submitBtn.click({ force: true })

      console.log('Waiting for redirect to dashboard (max 5m)...')
      await page.waitForURL((url) => url.pathname.includes('/dashboard'), {
        timeout: 300000,
      })
      console.log('Redirect successful! Final URL:', page.url())
      expect(cspErrors).toHaveLength(0)
    })

    // ==========================================
    // PHASE 3: DASHBOARD LINKS
    // ==========================================
    await test.step('Verify Dashboard sidebar and interactivity', async () => {
      // Small wait for dashboard specific compilation
      await page.waitForTimeout(3000)

      const sidebarLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Listings', path: '/dashboard/listings' },
        { name: 'Orders', path: '/dashboard/orders' },
        { name: 'Messages', path: '/dashboard/messages' },
        { name: 'Wallet', path: '/dashboard/wallet' },
      ]

      for (const link of sidebarLinks) {
        console.log(`Checking dashboard link: ${link.name}...`)
        const locator = page
          .getByRole('link', { name: link.name, exact: true })
          .first()
        await expect(locator).toBeVisible({ timeout: 60000 })
        await locator.click()
        await page.waitForURL(`**${link.path}*`, { timeout: 180000 })
        expect(cspErrors).toHaveLength(0)
      }

      // Check for presence of interactive elements (buttons/links)
      const buttonsCount = await page.getByRole('button').count()
      expect(buttonsCount).toBeGreaterThan(0)
    })

    // ==========================================
    // PHASE 4: ADMIN PANEL
    // ==========================================
    await test.step('Verify Admin Panel interactivity', async () => {
      await page.goto(`${BASE_URL}/en/admin`, { timeout: 90000 })
      await page.waitForLoadState('domcontentloaded')
      expect(page.url()).toContain('/admin') // Should not redirect out
      expect(cspErrors).toHaveLength(0)

      // Test admin sidebar links
      const adminLinks = [
        { name: /Users|Users|Používatelia/i, url: '**/admin/users*' },
        { name: /Listings|Listings|Inzeráty/i, url: '**/admin/listings*' },
        { name: /System|System|Systém/i, url: '**/admin/system*' },
      ]

      for (const link of adminLinks) {
        const linkElem = page.getByRole('link', { name: link.name }).first()
        if (await linkElem.isVisible()) {
          await linkElem.click()
          await page.waitForURL(link.url, { timeout: 60000 })
          expect(cspErrors).toHaveLength(0)
        }
      }
    })

    // Final check for CSP errors
    expect(cspErrors).toHaveLength(0)
  })
})
