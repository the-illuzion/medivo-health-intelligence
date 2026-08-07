import { test, expect } from '@playwright/test';

test.describe('Marketing Website E2E Flow', () => {
  const MARKETING_URL = 'http://localhost:3000';

  test('should render Marketing Landing Page with Clinical AI Skin Intelligence title', async ({ page }) => {
    await page.goto(MARKETING_URL);
    await expect(page.locator('h1')).toContainText('Clinical AI Skin Intelligence');
    await expect(page.locator('text=HIPAA Compliant Security')).toBeVisible();
  });

  test('should interact with Live AI Skin Score Simulator sliders', async ({ page }) => {
    await page.goto(MARKETING_URL);
    const simulatorHeading = page.locator('text=Live AI Skin Score Simulator');
    await expect(simulatorHeading).toBeVisible();

    const hydrationSlider = page.locator('input[type="range"]').first();
    await hydrationSlider.fill('90');
    await expect(page.locator('text=90%')).toBeVisible();
  });

  test('should navigate to Clinical Studies and Pricing pages', async ({ page }) => {
    await page.goto(MARKETING_URL);

    // Clinical Studies
    await page.click('text=Clinical Studies');
    await expect(page).toHaveURL(/.*clinical-studies/);
    await expect(page.locator('h1')).toContainText('99.4% Clinical Diagnostic Accuracy');

    // Pricing
    await page.click('text=Pricing');
    await expect(page).toHaveURL(/.*pricing/);
    await expect(page.locator('text=Medivo Pro')).toBeVisible();
  });
});
