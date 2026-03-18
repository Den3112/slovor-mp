import { test, expect } from '@playwright/test'

const BASE_URL = 'http://127.0.0.1:3000'

test('check scripts and nonces', async ({ page }) => {
  await page.goto(`${BASE_URL}/en`)

  const scripts = await page.locator('script').elementHandles()
  console.log(`Found ${scripts.length} scripts`)

  const nonceHeader = await page.evaluate(() => {
    // We can't easily get headers from JS, but we can check if Next.js put it somewhere
    return document
      .querySelector('meta[property="csp-nonce"]')
      ?.getAttribute('content')
  })

  console.log(`Nonce from meta (if exists): ${nonceHeader}`)

  for (const script of scripts) {
    const src = await script.getAttribute('src')
    const nonce = await script.getAttribute('nonce')
    const content = await script.textContent()

    if (src) {
      console.log(`External Script: ${src}, Nonce: ${nonce || 'MISSING'}`)
    } else {
      console.log(
        `Inline Script (length ${content?.length}), Nonce: ${nonce || 'MISSING'}`
      )
    }
  }

  // Also check if links are physically present and clickable
  const dashboardLink = page.locator('a[href*="/dashboard"]').first()
  if (await dashboardLink.isVisible()) {
    console.log('Dashboard link is visible')
    const box = await dashboardLink.boundingBox()
    console.log(`Link box: ${JSON.stringify(box)}`)
  }
})
