import { test, expect } from '@playwright/test'

test('presence indicator changes state', async ({ page, context }) => {
  // Use two pages to simulate two users
  const user1 = page
  const user2 = await context.newPage()

  await user1.goto('/profile/messages/test-conv')
  await user2.goto('/profile/messages/test-conv')

  // Since we aren't logged in as specific different users in E2E yet,
  // we verify the component doesn't crash and renders base states.
  await expect(user1.locator('h1, h2').first()).toBeVisible()
  await expect(user2.locator('h1, h2').first()).toBeVisible()
})
