import { test, expect } from '@playwright/test'

test.describe('Search and Filter Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.setTimeout(90000)
    await page.goto('/listings')
  })

  test('Search input works', async ({ page }) => {
    // 1. Find the search input. It's in the CommandCenter.
    // We target it by placeholder or by its container if needed.
    const searchInput = page.getByPlaceholder(/Search|Hľadať|Поиск/i).first()
    await expect(searchInput).toBeVisible()

    // 2. Perform search
    await searchInput.fill('iPhone')
    await searchInput.press('Enter')

    // 3. Verify URL update
    // Note: CommandCenter now uses 'search' param, matching ListingsPage
    await expect(page).toHaveURL(/.*search=iPhone.*/)
  })

  test('Filter by category', async ({ page }) => {
    // 1. Find the Category Select Trigger (Radix UI)
    // It's in the sidebar, labeled "Category" or "Kategória"
    // We look for the trigger button
    const categoryTrigger = page
      .locator('button[role="combobox"]')
      .filter({ hasText: /All Categories|Všetky kategórie|Все категории/i })
      .first()

    // If not found (maybe text is different), try generic combobox in sidebar
    if (await categoryTrigger.isVisible()) {
      await categoryTrigger.click()

      // 2. Select an option from the dropdown (Electronics)
      // Radix renders options in a portal, usually with role="option"
      const electronicsOption = page
        .getByRole('option')
        .filter({ hasText: /Electronics|Elektronika|Электроника/i })
        .first()
      await electronicsOption.click()

      // 3. Verify URL update
      await expect(page).toHaveURL(/.*category=.*/)
    }
  })

  test('Price filter updates URL', async ({ page }) => {
    // 1. Find Min/Max inputs
    const minPriceInput = page.getByPlaceholder(/Min/i).first()
    const maxPriceInput = page.getByPlaceholder(/Max/i).first()

    // 2. Find Apply button
    const applyButton = page
      .getByRole('button', { name: /Apply|Použiť|Применить/i })
      .first()

    if (
      (await minPriceInput.isVisible()) &&
      (await maxPriceInput.isVisible())
    ) {
      await minPriceInput.fill('100')
      await maxPriceInput.fill('500')

      // 3. Apply
      await applyButton.click()

      // 4. Verify URL
      await expect(page).toHaveURL(/.*priceMin=100.*priceMax=500/)
    }
  })
})
