import { test, expect } from '@playwright/test'

test.use({ storageState: 'e2e/.auth/user.json' })

test.describe('Admin Dashboard Access', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/admin')
    await page.waitForLoadState('domcontentloaded')

    // If redirected to login or home, test will fail assertion
  })

  test('Admin Sidebar and Navigation', async ({ page }) => {
    // Assert we are on admin
    await expect(page).toHaveURL(/.*\/admin/)

    // Check Sidebar
    await expect(page.getByTestId('dashboard-sidebar')).toBeVisible()

    // Check Links presence (using partial text from translations or icon logic if possible, but regex is safest for multi-lang)
    // Adjusting regex to likely translations

    // Overview / Dashboard
    await expect(
      page.getByRole('link', { name: /Dashboard|Prehľad|Overview/i })
    ).toBeVisible()

    // Listings / Moderation
    await expect(
      page.getByRole('link', {
        name: /Moderation|Moderácia|Listings|Inzeráty/i,
      })
    ).toBeVisible()

    // Users
    await expect(
      page.getByRole('link', { name: /Users|Používatelia/i })
    ).toBeVisible()

    // Reports
    await expect(
      page.getByRole('link', { name: /Reports|Sťažnosti|Nahlásenia/i })
    ).toBeVisible()

    // Verifications
    await expect(
      page.getByRole('link', { name: /Verifications|Verifikácie|Overenia/i })
    ).toBeVisible()

    // Content
    await expect(
      page.getByRole('link', { name: /Content|Obsah/i })
    ).toBeVisible()
  })

  test('Admin Mobile Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    // Sidebar should be hidden
    await expect(page.getByTestId('dashboard-sidebar')).not.toBeVisible()

    // Open Dashboard Drawer using specific testid
    const trigger = page.getByTestId('mobile-sidebar-trigger')
    await expect(trigger).toBeVisible()
    await trigger.click()

    // Wait for dialog to be visible
    const dialog = page.locator('[role="dialog"]')
    await expect(dialog).toBeVisible()

    // Check link in drawer
    const usersLink = dialog.getByRole('link', { name: /Users|Používatelia/i })
    await expect(usersLink).toBeVisible()

    // Navigate
    await usersLink.click()
    await expect(page).toHaveURL(/.*\/admin\/users/)
  })
  test('Role Switcher Navigation', async ({ page }) => {
    // Expect "User menu" button and click to open dropdown
    const userMenuButton = page
      .getByLabel('User menu')
      .filter({ visible: true })
    await expect(userMenuButton).toBeVisible()
    await userMenuButton.click()

    // Switch to seller dashboard
    const sellerDashboardLink = page
      .locator('a[href$="/dashboard"]')
      .filter({ visible: true })
    await expect(sellerDashboardLink).toBeVisible()
    await sellerDashboardLink.click()

    // Should be on dashboard
    await expect(page).toHaveURL(/.*\/dashboard/)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Switch back to admin
    const userMenuButtonReturn = page
      .getByLabel('User menu')
      .filter({ visible: true })
    await expect(userMenuButtonReturn).toBeVisible()
    await userMenuButtonReturn.click()

    const adminLink = page
      .getByRole('link', { name: /Admin Panel/i })
      .filter({ visible: true })
    await expect(adminLink).toBeVisible()
    await adminLink.click()

    await expect(page).toHaveURL(/.*\/admin/)
  })

  test('Language Switcher Functionality', async ({ page }) => {
    // Open language dropdown - searching by testid or exact translated label is safer
    // The button has aria-label="Select language" (EN) or "Vybrať jazyk" (SK)
    const langButton = page
      .getByLabel(/Select language|Vybrať jazyk/i)
      .filter({ visible: true })
    await expect(langButton).toBeVisible()
    await langButton.click()

    // Switch to Slovak
    await page.getByRole('button', { name: /Slovenčina/i }).click()

    // URL should change to /sk/admin
    await expect(page).toHaveURL(/.*\/sk\/admin/)

    // Switch back to English
    const langButtonSK = page
      .getByLabel(/Select language|Vybrať jazyk/i)
      .filter({ visible: true })
    await expect(langButtonSK).toBeVisible()
    await langButtonSK.click()

    await page.getByRole('button', { name: /English/i }).click()
    await expect(page).toHaveURL(/.*\/en\/admin/)
  })
})
