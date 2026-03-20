import { test } from '@playwright/test'

test('Debug Cookies', async ({ page }) => {
  await page.goto('/en/auth/login')
  await page.getByTestId('auth-email-input').fill('test.seller@slovor.sk')
  await page.getByTestId('auth-password-input').fill('password123') // Assuming this is set up
  await page.getByTestId('auth-submit-btn').click()

  await page.waitForURL('**/dashboard', { timeout: 15000 })
  const cookies = await page.context().cookies()
  console.log('REAL COOKIES:', JSON.stringify(cookies, null, 2))
})
