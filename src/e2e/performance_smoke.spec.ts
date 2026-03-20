import { test, expect } from '@playwright/test'

test('Homepage performance smoke test', async ({ page }) => {
  const startTime = Date.now()
  await page.goto('/')
  const endTime = Date.now()
  const loadTime = endTime - startTime

  console.log(`Homepage load time: ${loadTime}ms`)
  expect(loadTime).toBeLessThan(5000) // Expect homepage to load in less than 5s

  // Check for initial paint of critical elements
  await expect(page.locator('h1')).toBeVisible()
})

test('Lighthouse-style performance basic check', async ({ page }) => {
  await page.goto('/')
  const performanceEntries = await page.evaluate(() =>
    JSON.stringify(performance.getEntriesByType('navigation'))
  )
  const navData = JSON.parse(performanceEntries)[0]

  console.log('Navigation Data:', navData)
  expect(navData.duration).toBeLessThan(10000)
})
