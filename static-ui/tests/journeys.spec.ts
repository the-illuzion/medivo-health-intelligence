import { expect, test } from '@playwright/test';
test('home navigation, status carousel, sheets and metric periods', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Good morning, Aanya' })).toBeVisible();
  await page.getByRole('button', { name: /Your Health Status/ }).click();
  await expect(page.getByText('1 / 4', { exact: true })).toBeVisible();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.locator('.dots button.selected')).toHaveAttribute(
      'aria-label',
      `Go to slide ${i + 2}`,
    );
  }
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: /Insight for You/ }).click();
  await expect(page.getByRole('dialog', { name: 'Insights for You' })).toBeVisible();
  await page.getByRole('button', { name: 'Go to slide 2' }).click();
  await expect(page.locator('.dots button.selected')).toHaveAttribute(
    'aria-label',
    'Go to slide 2',
  );
  await page.getByRole('button', { name: 'Got it' }).click();
  await page.getByRole('button', { name: 'View details', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Health alert' })).toBeVisible();
  await page
    .getByRole('dialog', { name: 'Health alert' })
    .getByRole('button', { name: 'View details', exact: true })
    .click();
  await expect(page.getByRole('dialog', { name: 'Heart Rate details' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('navigation').getByRole('button', { name: 'Insights' }).click();
  await page.getByRole('tab', { name: 'Month', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Month', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.locator('.metric-row').filter({ visible: true }).first()).toContainText('72');
});
test('care tasks complete, remain complete after navigating, collapse and date control', async ({
  page,
}) => {
  await page.goto('/#care');
  await page.getByRole('button', { name: 'Complete Light activity', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Undo completion of Light activity' }),
  ).toContainText('Completed');
  await page.getByRole('navigation').getByRole('button', { name: 'Home', exact: true }).click();
  await page.getByRole('navigation').getByRole('button', { name: 'Care', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Undo completion of Light activity' }),
  ).toBeVisible();
  await page.getByLabel('Care plan date').fill('2025-04-29');
  await expect(page.getByLabel('Care plan date')).toHaveValue('2025-04-29');
  await page.getByRole('button', { name: /Morning Start your day well/ }).click();
  await expect(
    page.getByRole('button', { name: 'Undo completion of Light activity' }),
  ).not.toBeVisible();
  await page.getByRole('button', { name: 'Mark all done' }).click();
  await expect(page.getByRole('button', { name: 'All tasks completed' })).toBeDisabled();
});
test('device toggles, reconnect and connection success', async ({ page }) => {
  await page.goto('/#devices');
  const toggle = page.getByRole('switch', { name: 'Apple Watch sync' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-checked', 'true');
  await page.getByRole('button', { name: 'Reconnect', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Reconnected (1)' })).toBeVisible();
  await page.getByRole('button', { name: 'Connect Apple Watch', exact: true }).click();
  await page.getByRole('button', { name: 'Connect now', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Device connected' })).toBeVisible();
  await page.getByRole('button', { name: 'View devices', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Manage Devices' })).toBeVisible();
});
test('scan requires consent and completes; manual entry and profile edits save', async ({
  page,
}) => {
  await page.goto('/#scan');
  await page.getByRole('button', { name: 'Begin Face Scan' }).click();
  await expect(page.getByRole('button', { name: 'Start simulated scan' })).toBeDisabled();
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Start simulated scan' }).click();
  await expect(page.getByRole('heading', { name: 'Your scan is complete' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: /Manual Entry Log/ }).click();
  await page.getByLabel('Reading', { exact: true }).fill('72 bpm');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Saved successfully')).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('navigation').getByRole('button', { name: 'Profile', exact: true }).click();
  await page.getByRole('button', { name: 'Edit Profile', exact: true }).click();
  await page.getByLabel('Full name').fill('Aanya Sharma');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Aanya Sharma' })).toBeVisible();
});
test('all screens fit 390px and 430px; capture visual review', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const width of [390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      'home',
      'metrics',
      'care',
      'scan',
      'profile',
      'devices',
      'connect',
      'status',
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.locator('main')).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
      ).toBe(true);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width, height });
      await page.screenshot({ path: `review/${route}-${width}.png`, fullPage: true });
      await page.setViewportSize({ width, height: 844 });
    }
  }
  expect(errors).toEqual([]);
});

test('sheet accessibility, partial cards and all four status slides', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Insight for You/ }).click();
  await expect(page.locator('.app-shell > div[inert]')).toHaveCount(1);
  await page.screenshot({ path: 'review/insights-sheet-390.png' });
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button', { name: 'View details', exact: true }).click();
  await page.screenshot({ path: 'review/alert-sheet-390.png' });
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await page.goto('/#status');
  for (let i = 0; i < 4; i++) {
    await page.getByRole('button', { name: `Go to slide ${i + 1}` }).click();
    await expect(page.locator('.dots button.selected')).toHaveAttribute(
      'aria-label',
      `Go to slide ${i + 1}`,
    );
    await expect
      .poll(() =>
        page
          .locator('.status-track')
          .evaluate((el, n) => Math.abs(el.scrollLeft - el.clientWidth * n), i),
      )
      .toBeLessThan(2);
    await page.screenshot({ path: `review/status-slide-${i + 1}-390.png`, fullPage: true });
  }
});
