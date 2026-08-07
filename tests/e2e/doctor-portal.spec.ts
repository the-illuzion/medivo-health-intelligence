import { test, expect } from '@playwright/test';

test.describe('Doctor Portal & Telehealth E2E Flow', () => {
  const DOCTOR_PORTAL_URL = 'http://localhost:3001';

  test('should render Doctor Portal dashboard with HIPAA Verified MD badge', async ({ page }) => {
    await page.goto(DOCTOR_PORTAL_URL);
    await expect(page.locator('h1')).toContainText('Medivo Clinical Portal');
    await expect(page.locator('text=HIPAA Verified MD')).toBeVisible();
    await expect(page.locator('text=Dr. Rachel Vance, MD')).toBeVisible();
  });

  test('should display upcoming patient consultation appointments', async ({ page }) => {
    await page.goto(DOCTOR_PORTAL_URL);
    await expect(page.locator('text=Alex Morgan')).toBeVisible();
    await expect(page.locator('text=Barrier Damage Assessment')).toBeVisible();
    await expect(page.locator('button:has-text("Start Session")').first()).toBeVisible();
  });
});
