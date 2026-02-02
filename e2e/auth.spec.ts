import { test, expect } from '@playwright/test'

test.describe('Authentication Flow & UI', () => {
  test.beforeEach(async ({ page }) => {
    // Start at English login page
    await page.goto('/en/auth/login')
  })

  test('Login page renders correctly with new UI fixes', async ({ page }) => {
    // Check Title
    await expect(page.locator('h1')).toContainText(/Welcome Back|Vitajte späť|С возвращением/i)

    // Check Subtitle (should NOT contain "premium")
    const subtitle = page.locator('p.text-muted-foreground')
    await expect(subtitle).not.toContainText(/premium|prémiov/i)

    // Check Header: Sign In button should be hidden
    const headerSignIn = page.locator('header').getByRole('link', { name: /Sign In|Prihlásiť/i })
    await expect(headerSignIn).not.toBeVisible()

    // Check Forgot Password link
    const forgotPassword = page.getByRole('button', { name: /Forgot password|Zabudnuté heslo|Забыли пароль/i })
    await expect(forgotPassword).toBeVisible()

    // Check labels readability (should be visible)
    await expect(page.locator('label', { hasText: /Email|E-mail/i })).toBeVisible()
    await expect(page.locator('label', { hasText: /Password|Heslo|Пароль/i })).toBeVisible()
  })

  test('Redirects work correctly', async ({ page }) => {
    // Root should redirect to localized home
    await page.goto('/')
    await expect(page.url()).toMatch(/\/en|\/sk|\/cs|\/ru/)

    // Protected route redirect
    await page.goto('/dashboard')
    await expect(page.url()).toContain('/auth/login')
  })

  test('Invalid login shows error', async ({ page }) => {
    await page.getByTestId('auth-email-input').fill('wrong@example.com')
    await page.getByTestId('auth-password-input').fill('wrongpassword')
    await page.getByTestId('auth-submit-btn').click()

    // Error message should appear (handled by Supabase or our error state)
    // Increased timeout for slow network/Supabase response
    const errorContainer = page.getByTestId('auth-error-alert')
    await expect(errorContainer).toBeVisible({ timeout: 20000 })
  })

  test('Toggle between Login and Register', async ({ page }) => {
    // Click Sign Up link using data-testid
    await page.getByTestId('auth-toggle-mode-btn').click()

    // URL may change if we use state-based toggle, or stay same
    // But text should change
    await expect(page.locator('h1')).toContainText(/Join Slovor|Pridať sa/i)

    // Check that "Forgot password" is HIDDEN in register mode
    const forgotPassword = page.getByRole('button', { name: /Forgot password|Zabudnuté heslo|Забыли пароль/i })
    await expect(forgotPassword).not.toBeVisible()
  })
})
