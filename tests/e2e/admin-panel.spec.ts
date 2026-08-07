import { test, expect } from '@playwright/test';

test.describe('Platform Admin Console E2E Flow', () => {
  const ADMIN_PANEL_URL = 'http://localhost:3002';

  test('should render Executive Overview with 100% HIPAA Audit Compliance indicator', async ({ page }) => {
    await page.goto(ADMIN_PANEL_URL);
    await expect(page.locator('h1')).toContainText('Platform Telemetry Overview');
    await expect(page.locator('text=HIPAA Audit Compliance: 100%')).toBeVisible();
  });

  test('should display Live HIPAA Audit Logs and Node Health status', async ({ page }) => {
    await page.goto(ADMIN_PANEL_URL);
    await expect(page.locator('text=Live HIPAA Audit Logs')).toBeVisible();
    await expect(page.locator('text=Customer BFF API')).toBeVisible();
    await expect(page.locator('text=100% ONLINE').first()).toBeVisible();
  });

  test('should navigate to HIPAA Audit Log Viewer page', async ({ page }) => {
    await page.goto(ADMIN_PANEL_URL);
    await page.click('text=HIPAA Audit Trail');
    await expect(page).toHaveURL(/.*hipaa-audit/);
    await expect(page.locator('h1')).toContainText('HIPAA Compliance & Consent Audit Viewer');
    await expect(page.locator('button:has-text("Export Compliance Report (CSV)")')).toBeVisible();
  });
});
