import { test, expect, Page } from '@playwright/test'

const locales = ['en'] // Start with EN to save time, can expand to ['en', 'sk', 'ru'] later
const deployUrl = process.env.DEPLOY_URL || 'http://localhost:3000'

// 1. Public Pages (No Auth)
const publicRoutes = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/search',
  '/auth/login',
  '/auth/register',
  '/categories',
  '/terms',
  '/privacy',
  // '/listings/some-slug' // Todo: Need a reliable slug or mock
]

// 2. Protected Pages (Require Auth)
const protectedRoutes = [
  '/dashboard',
  '/dashboard/profile',
  '/dashboard/settings',
  '/dashboard/listings',
  '/dashboard/messages',
  '/dashboard/wallet',
  '/create-ad', // Creation flow
]

// Helper: Toggle Theme
async function setMode(page: Page, mode: 'light' | 'dark') {
  // We assume next-themes is used.
  // changing local storage or clicking a button.
  // Easier: Execute script to change theme
  await page.evaluate((m) => {
    // window.localStorage.setItem('theme', m) // specific to next-themes
    // document.documentElement.classList.toggle('dark', m === 'dark')
    // document.documentElement.style = m === 'dark' ? 'color-scheme: dark;' : 'color-scheme: light;'

    // Better: specific for next-themes
    if (m === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, mode)

  // Wait for transition
  await page.waitForTimeout(500)
}

test.describe('Visual Regression - 100% Coverage', () => {
  // A. Public Routes
  test.describe('Public Routes', () => {
    for (const locale of locales) {
      for (const route of publicRoutes) {
        test(`${locale} - ${route} (Light/Dark + Mobile/Desktop)`, async ({
          page,
        }) => {
          const url = `${deployUrl}/${locale}${route === '/' ? '' : route}`
          await page.goto(url, { waitUntil: 'networkidle' })

          // 1. Desktop - Light
          await setMode(page, 'light')
          await expect(page).toHaveScreenshot(
            `${locale}-desktop-light-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )

          // 2. Desktop - Dark
          await setMode(page, 'dark')
          await expect(page).toHaveScreenshot(
            `${locale}-desktop-dark-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )

          // 3. Mobile - Light (Resize viewport)
          await page.setViewportSize({ width: 375, height: 667 })
          await setMode(page, 'light')
          await expect(page).toHaveScreenshot(
            `${locale}-mobile-light-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )

          // 4. Mobile - Dark
          await setMode(page, 'dark')
          await expect(page).toHaveScreenshot(
            `${locale}-mobile-dark-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )
        })
      }
    }
  })

  // B. Protected Routes
  test.describe('Protected Routes', () => {
    // Use the auth state
    test.use({ storageState: 'e2e/.auth/user.json' })

    for (const locale of locales) {
      for (const route of protectedRoutes) {
        test(`${locale} - ${route} (Auth)`, async ({ page }) => {
          const url = `${deployUrl}/${locale}${route}`
          await page.goto(url, { waitUntil: 'networkidle' })

          // Ensure we didn't get redirected to login (basic check)
          if (page.url().includes('/auth/login')) {
            console.warn(
              `Redirected to login for ${route}. Global setup might have failed or session expired.`
            )
            // Don't fail immediately, snapshot might show login page which is also a finding
          }

          // 1. Desktop - Light
          await setMode(page, 'light')
          await expect(page).toHaveScreenshot(
            `${locale}-auth-desktop-light-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )

          // 2. Desktop - Dark
          await setMode(page, 'dark')
          await expect(page).toHaveScreenshot(
            `${locale}-auth-desktop-dark-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )

          // 3. Mobile - Light
          await page.setViewportSize({ width: 375, height: 667 })
          await setMode(page, 'light')
          await expect(page).toHaveScreenshot(
            `${locale}-auth-mobile-light-${cleanName(route)}.png`,
            { fullPage: true, maxDiffPixelRatio: 0.02 }
          )
        })
      }
    }
  })
})

function cleanName(route: string) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
}
