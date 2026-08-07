import { test, expect } from '@playwright/test';

test.describe('Customer Web & Mobile App E2E Flow', () => {
  const CUSTOMER_APP_URL = 'http://localhost:8081';
  const BFF_API_URL = 'http://localhost:4000';

  test('should load Customer App home dashboard with Clinical Blue branding', async ({ page }) => {
    await page.goto(CUSTOMER_APP_URL);
    await expect(page).toHaveTitle(/Medivo/i);
    await expect(page.locator('text=Health Intelligence')).toBeVisible();
  });

  test('should navigate via floating bottom tab bar on mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(CUSTOMER_APP_URL);

    // Verify Home tab
    await expect(page.locator('text=Home')).toBeVisible();

    // Navigate to Scan
    await page.click('text=Scan');
    await expect(page).toHaveURL(/.*scan/);

    // Navigate to Shop
    await page.click('text=Shop');
    await expect(page).toHaveURL(/.*products/);

    // Navigate to Profile
    await page.click('text=Profile');
    await expect(page).toHaveURL(/.*profile/);
  });

  test('should trigger AI Skin Scan inference endpoint via Customer BFF', async ({ request }) => {
    const response = await request.post(`${BFF_API_URL}/api/v1/scans/analyze`, {
      data: {
        userId: 'usr-101',
        imageBase64: 'data:image/jpeg;base64,mock_image_payload',
      },
    });

    expect(response.ok()).toBeTruthy();
    const json = await response.json();
    expect(json.success).toBe(true);
    expect(json.data.overallScore).toBeGreaterThanOrEqual(70);
    expect(json.data.status).toBe('COMPLETED');
  });
});
