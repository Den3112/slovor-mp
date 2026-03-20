import { test, expect } from '@playwright/test'

test.describe('Admin Moderation', () => {
  test('Admin can approve a pending listing', async ({ page }) => {
    // Intercept everything to control data flow
    await page.route('**', async (route) => {
      const url = route.request().url()
      const method = route.request().method()
      const type = route.request().resourceType()

      // Pass through static assets and scripts
      if (
        ['image', 'stylesheet', 'font', 'script'].includes(type) ||
        url.includes('.js') ||
        url.includes('.css')
      ) {
        await route.continue()
        return
      }

      // Mock Listings Request
      if (url.includes('listings') && url.includes('rest/v1')) {
        if (method === 'GET') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                id: 'pending-listing-123',
                title: 'Pending Laptop', // Simplified title
                price: 999,
                currency: 'EUR',
                status: 'pending',
                created_at: new Date().toISOString(),
                images: [],
                user_id: 'user-123',
                category: { name: 'Electronics' },
                user: { display_name: 'Test Seller' },
              },
            ]),
          })
          return
        }
        if (method === 'PATCH') {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              id: 'pending-listing-123',
              status: 'active',
            }),
          })
          return
        }
      }

      // Mock HEAD generally
      if (method === 'HEAD') {
        await route.fulfill({
          status: 200,
          headers: { 'Content-Range': '0-10/10' },
        })
        return
      }

      // Mock other GETs as empty
      if (method === 'GET' && url.includes('rest/v1')) {
        await route.fulfill({
          status: 200,
          body: '[]',
          contentType: 'application/json',
        })
        return
      }

      await route.continue()
    })

    await page.goto('/admin/listings')

    // Verify page loaded
    await expect(
      page.getByRole('heading', { name: /moderation/i })
    ).toBeVisible({ timeout: 15000 })

    // Verify list loaded
    const rows = page.locator('tbody tr')
    await expect(rows).toHaveCount(1, { timeout: 10000 })

    // Check title (case insensitive)
    await expect(page.getByText('Pending Laptop')).toBeVisible()

    // Reset approved status by checking pending indicator
    // pending usually has amber color or specific text
    // We check availability of Approve button
    const approveBtn = page
      .locator('button')
      .filter({ has: page.locator('.lucide-check-circle-2') })
      .first()
    await expect(approveBtn).toBeVisible()

    // Click Approve
    await approveBtn.click()

    // Expect toast or UI update
    await expect(page.getByText(/approved/i)).toBeVisible({ timeout: 5000 })

    // Verify button changed to "Draft/Shield" (meaning it is now active)
    const draftBtn = page
      .locator('button')
      .filter({ has: page.locator('.lucide-shield-alert') })
      .first()
    await expect(draftBtn).toBeVisible()
  })
})
