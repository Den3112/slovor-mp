import { test, expect } from '@playwright/test'
import { AuthPage } from './pages/auth-page'
import { runUniversalHealthCheck } from './utils/health-check'

test.describe('Standardized Authentication Flow', () => {
  let authPage: AuthPage

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page)
    await authPage.goto('en')
  })

  test('Universal Health Check - Login Page', async ({ page }) => {
    await runUniversalHealthCheck(page)
  })

  test('Invalid login shows error via standardized POM', async () => {
    // We use a dummy user to verify the error UI
    // No need to create this user in DB because WE WANT IT TO FAIL for this test
    await authPage.login('security-test@slovor.sk', 'definitely-wrong-password')
    await authPage.expectError()
    await expect(authPage.errorAlert).toContainText(/Invalid|credentials/i)
  })

  test('Toggle between Login and Register works reliably', async () => {
    await authPage.toggleToRegister()
    await expect(authPage.page.locator('h1')).toContainText(
      /Join Slovor|Pridať sa|Pridat se|Присоединяйся/i
    )
    await authPage.expectNoForgotLink()

    // Toggle back
    await authPage.toggleToRegister()
    await expect(authPage.page.locator('h1')).toContainText(
      /Welcome Back|Vitajte späť|С возвращением/i
    )
  })

  test('Empty inputs validation', async () => {
    await authPage.submitBtn.click()
    // HTML5 validation might prevent submit or we show custom error
    // If we use HTML5 validation, the input will be :invalid
    const isEmailValid = await authPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    )
    expect(isEmailValid).toBe(false)
  })
})
