import { test, expect } from '@playwright/test'

const locales = ['en', 'sk', 'cs', 'ru'] // Testing main locales
const deployUrl = process.env.DEPLOY_URL || 'http://localhost:3000'

// Pages that don't require authentication and should look consistent
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
]

test.describe('Visual Regression Tests', () => {
    for (const locale of locales) {
        test.describe(`${locale} Locale`, () => {
            for (const route of publicRoutes) {
                test(`Visual snapshot of ${route}`, async ({ page }) => {
                    // Navigate to the page
                    await page.goto(`${deployUrl}/${locale}${route === '/' ? '' : route}`, {
                        waitUntil: 'networkidle',
                    })

                    // Hide dynamic elements that might cause flakiness (e.g., ads, random listings if any)
                    // Example: hiding a specific class if known
                    // await page.addStyleTag({ content: '.dynamic-content { visibility: hidden; }' })

                    // Take a full page screenshot
                    // We use a custom name to avoid filename clashes
                    // Clean up route name: / -> home, /about -> about, /auth/login -> auth-login
                    const cleanRouteName = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-')
                    const screenshotName = `${locale}-${cleanRouteName}.png`

                    await expect(page).toHaveScreenshot(screenshotName, {
                        fullPage: true,
                        maxDiffPixelRatio: 0.02, // Allow small rendering differences (2%)
                        animations: 'disabled',
                    })
                })
            }

            test('Visual snapshot of 404 page', async ({ page }) => {
                await page.goto(`${deployUrl}/${locale}/non-existent-page-123`, {
                    waitUntil: 'networkidle',
                })
                await expect(page).toHaveScreenshot(`${locale}-404.png`, {
                    fullPage: true,
                    maxDiffPixelRatio: 0.02,
                    animations: 'disabled',
                })
            })
        })
    }
})
