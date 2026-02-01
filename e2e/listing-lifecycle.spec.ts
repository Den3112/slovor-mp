import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Listing Lifecycle', () => {
  test('User can create a new listing', async ({ page }) => {
    // 0. Setup: Mock Supabase and API responses
    const filePath = path.join(__dirname, 'assets/test_image.jpg');

    // Mock Categories
    await page.route('**/rest/v1/categories*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', name: 'Transport', slug: 'transport', icon: 'Car' },
          { id: '2', name: 'Electronics', slug: 'electronics', icon: 'Smartphone' },
        ]),
      });
    });

    // Mock Listing Creation
    await page.route('**/rest/v1/listings*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'test-listing-id-123' }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock Translation Generation
    await page.route('**/functions/v1/generate-translations', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          title_en: 'Translated Title',
          description_en: 'Translated Description',
        }),
      });
    });

    // 1. Navigate to creation page
    console.log('Navigating to /create-ad...');
    await page.goto('/create-ad');

    // Wait for loader to disappear
    console.log('Waiting for loader to disappear...');
    const loader = page.locator('.animate-spin');
    await expect(loader).toBeHidden({ timeout: 15000 });

    // Verify Title
    await expect(page.getByRole('heading', { name: /Create New Listing/i })).toBeVisible();

    // --- STEP 1: CATEGORY & CONDITION ---
    console.log('Step 1: Selecting Category...');
    const transportBtn = page.getByRole('button', { name: /Transport/i });
    await transportBtn.click();

    console.log('Step 1: Selecting Condition (New)...');
    const newBtn = page.locator('button').filter({ hasText: /^New$/i }).first();
    await newBtn.click();

    // Go to Step 2
    console.log('Step 1: Proceeding to Step 2...');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // --- STEP 2: DETAILS ---
    console.log('Step 2: Filling Details...');
    await page.getByPlaceholder(/What are you selling?/i).fill('Test Item Playwright');
    await page.getByPlaceholder(/^0$/).fill('100');
    await page.getByPlaceholder(/Tell buyers more about your item/i).fill('This is an automated test listing description. It should be long enough to pass validation.');

    // Select location (using Bratislava)
    console.log('Step 2: Selecting Location...');
    const locationInput = page.getByPlaceholder(/City, Region/i);
    await locationInput.click();
    await locationInput.pressSequentially('Bratislav', { delay: 150 });

    // Wait for the dropdown and press Enter
    // Our improved LocationCombobox selects the first result on Enter
    await page.waitForTimeout(1000);
    await locationInput.press('Enter');

    // Verify selection - wait for the input to have the value
    await expect(locationInput).toHaveValue('Bratislava', { timeout: 5000 });
    console.log('Location selected successfully.');

    // Go to Step 3
    console.log('Step 2: Proceeding to Step 3...');
    await page.getByRole('button', { name: /Next Step/i }).click();

    // --- STEP 3: IMAGES ---
    console.log('Step 3: Checking for Step 3 transition...');
    const step3Heading = page.getByRole('heading', { name: /Upload Photos/i });
    try {
      await expect(step3Heading).toBeVisible({ timeout: 5000 });
    } catch (e) {
      console.log('TRANSITION FAILED! Looking for validation errors...');
      const errors = await page.locator('[class*="text-destructive"]').allTextContents();
      console.log('Errors on page:', errors);
      throw new Error(`Step 2 -> Step 3 transition failed. Errors: ${errors.join(', ')}`);
    }

    console.log('Step 3: Uploading Images...');
    const fileChooserPromise = page.waitForEvent('filechooser');
    // Using for: true and regex for button name
    await page.getByRole('button', { name: /Select Images/i }).click({ force: true });
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(filePath);

    // Wait for upload and proceeding to publish
    console.log('Step 4: Publishing...');
    await page.waitForTimeout(3000); // Wait for state to settle

    // Try to click Publish button
    const publishButton = page.locator('button').filter({ hasText: /Publish|Uverejniť/i }).first();
    await expect(publishButton).toBeVisible({ timeout: 10000 });
    await publishButton.click({ force: true });

    // Verify redirection to Success or Dashboard
    console.log('Final: Waiting for redirection...');
    await expect(page).toHaveURL(/dashboard|success|listings/i, { timeout: 15000 });
    console.log('TEST PASSED! Listing created successfully.');
  });
});
