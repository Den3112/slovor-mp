import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E Test Configuration
 * Simplified: Only Chromium, focused on functionality testing
 * Run with: npx playwright test
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : 4,
  reporter: 'list',
  timeout: 300000, // 5m per test
  expect: {
    timeout: 30000, // 30s for assertions
  },
  use: {
    baseURL: 'http://localhost:3005',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 300000,
    navigationTimeout: 300000,
    storageState: 'e2e/.auth/user.json',
  },
  globalSetup: require.resolve('./e2e/global-setup'),

  // Only Chromium - focused on functionality, not cross-browser
  projects: [
    {
      name: 'Light Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'light',
      },
    },
    {
      name: 'Dark Mode',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
      },
    },
  ],

  /*
  webServer: {
    command: 'npm run dev -- --webpack',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 300000,
  },
*/
})
