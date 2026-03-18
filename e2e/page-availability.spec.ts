import { test, expect } from '@playwright/test'

const ROUTES_TO_TEST = [
  '/',
  '/en',
  '/sk',
  '/en/categories',
  '/en/categories/real-estate',
  '/en/categories/auto',
  '/sk/categories/real-estate',
  '/en/auth',
  '/sk/auth',
]

test.describe('Page Availability and Health Check', () => {
  // Use empty storage state for public smoke tests to avoid flakiness of global-setup
  test.use({ storageState: { cookies: [], origins: [] } })

  for (const route of ROUTES_TO_TEST) {
    test(`Route ${route} should load successfully without Internal Server Error`, async ({
      page,
    }) => {
      // 1. Navigate to the page and wait for the response
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })

      // 2. Ensure we got a response
      expect(response).toBeDefined()

      // 3. Verify the status code is Ok (200-299) or Not Modified (304)
      if (response) {
        const status = response.status()
        if (status >= 400) {
          console.log(`Failed URL: ${response.url()} | Status: ${status}`)
          // console.log(`Response Body: ${await response.text()}`) // don't read body if it hangs, just status
        }
        expect(status >= 200 && status < 400).toBeTruthy()
      }

      // 4. Verify the page doesn't just say "Internal Server Error"
      const content = await page.textContent('body')
      expect(content).not.toContain('Internal Server Error')
      expect(content).not.toContain(
        'Application error: a client-side exception has occurred'
      )

      // 5. Check that the page is not completely blank (has some basic structure)
      const hasMainOrDiv = await page.locator('main, div').first().isVisible()
      expect(hasMainOrDiv).toBeTruthy()
    })
  }

  test('Check a non-existent route returns not-found content', async ({
    page,
  }) => {
    const response = await page.goto(
      '/en/this-route-definitely-does-not-exist',
      { waitUntil: 'domcontentloaded' }
    )
    expect(response).toBeDefined()
    
    const content = await page.textContent('body')
    expect(content).not.toContain('Internal Server Error')
    
    // Check for common 404 text markers
    const lowerContent = content?.toLowerCase() || ''
    const isNotFound = lowerContent.includes('not found') || 
                       lowerContent.includes('could not be found') ||
                       lowerContent.includes('404')
    
    expect(isNotFound).toBeTruthy()
  })
})
