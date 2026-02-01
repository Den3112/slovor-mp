import { test, expect } from '@playwright/test';

test('Verify Test Route', async ({ page }) => {
    await page.goto('/test');
    await expect(page.getByRole('heading', { name: 'TEST PAGE' })).toBeVisible({ timeout: 10000 });
});
