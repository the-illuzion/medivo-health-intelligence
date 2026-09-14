const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const output = path.join(os.tmpdir(), 'medivo-native-checks', 'screenshots');
fs.mkdirSync(output, { recursive: true });

const fixture = {
  state: {
    user: {
      id: 'usr-101',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      skinType: 'Combination',
      hipaaConsent: true,
    },
    token: 'test-session-only',
    isAuthenticated: true,
    isOnboarded: true,
  },
  version: 0,
};

async function seed(page, onboarded = true) {
  await page.addInitScript(
    ({ fixture, onboarded }) => {
      fixture.state.isOnboarded = onboarded;
      localStorage.setItem('medivo_auth_session', JSON.stringify(fixture));
    },
    { fixture, onboarded },
  );
}

const tab = (page, name) => page.getByRole('tab', { name, exact: true });

test('sign-in destinations and primary authentication guard', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await seed(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Good morning/ })).toBeVisible();
});

test('onboarding remains required when not completed', async ({ page }) => {
  await seed(page, false);
  await page.goto('/');
  await expect(page).toHaveURL(/\/onboarding$/);
});

test('all primary application routes render smoothly at mobile widths', async ({ page }) => {
  await seed(page);
  const requests = [];
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/api/**', (route) => {
    requests.push(route.request().url());
    return route.fulfill({ json: {} });
  });

  for (const width of [390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      '',
      'insights',
      'care',
      'scan',
      'profile',
      'devices',
      'connect-device',
      'health-status',
      'metric-details',
    ]) {
      const url = route === '' ? '/' : route.startsWith('(') ? `/${route}` : `/${route}`;
      await page.goto(url);
      await expect(page.getByRole('heading').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({ path: path.join(output, `${route || 'home'}-${width}.png`) });
    }
  }
  expect(errors).toEqual([]);
});

test('carousel, insight and alert sheets, and metric details', async ({ page }) => {
  await seed(page);
  await page.goto('/');
  await page.getByRole('button', { name: 'Your Health Status', exact: true }).click();
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await expect(page.getByRole('tab', { name: `Go to slide ${i + 2}` })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  }
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  await page.getByRole('button', { name: 'Insight for You', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Insights for You' })).toBeVisible();
  await page.screenshot({ path: path.join(output, 'insights-sheet.png') });
  await page.getByRole('button', { name: 'Got it', exact: true }).click();

  await page.getByRole('button', { name: 'View details', exact: true }).click();
  await page.screenshot({ path: path.join(output, 'alert-sheet.png') });
  await page.getByRole('button', { name: 'View details', exact: true }).click();
  await expect(page).toHaveURL(/metric-details/);

  await tab(page, 'Insights').click();
  await tab(page, 'Month').click();
  await expect(tab(page, 'Month')).toHaveAttribute('aria-selected', 'true');
});

test('care state survives tab navigation and task toggle works', async ({ page }) => {
  await seed(page);
  await page.goto('/care');
  await page.getByRole('button', { name: 'Complete Light activity', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Undo completion of Light activity' }),
  ).toBeVisible();
  await tab(page, 'Home').click();
  await tab(page, 'Care').click();
  await expect(
    page.getByRole('button', { name: 'Undo completion of Light activity' }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Choose care plan date' }).click();
  await page.getByRole('button', { name: 'Next day' }).click();
  await expect(page.getByText('2025-04-29', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Morning tasks' }).click();
  await expect(page.getByRole('button', { name: 'Undo completion of Light activity' })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Mark all done' }).click();
  await expect(page.getByRole('button', { name: 'All tasks completed' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
});

test('scan consent, profile edit, device management and connections', async ({ page }) => {
  await seed(page);
  await page.goto('/scan');
  await page.getByRole('button', { name: 'Begin Face Scan' }).click();
  await expect(page.getByRole('button', { name: 'Start scan' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await page.getByRole('checkbox', { name: 'Agree to start scan' }).click();
  await page.getByRole('button', { name: 'Start scan' }).click();
  await expect(page.getByRole('heading', { name: 'Your scan is complete' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();

  await tab(page, 'Profile').click();
  await page.getByRole('button', { name: 'Edit Profile', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Alex Morgan Live');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Alex Morgan Live' })).toBeVisible();

  await page.goto('/devices');
  await page.getByRole('switch', { name: 'Apple Watch sync' }).click();
  await expect(page.getByRole('switch', { name: 'Apple Watch sync' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Reconnect', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Reconnected (1)' })).toBeVisible();
  await page.getByRole('button', { name: 'Connect Apple Watch', exact: true }).click();
  await page.getByRole('button', { name: 'Connect now', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Apple Watch connected' })).toBeVisible();
  await page.getByRole('button', { name: 'View devices', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Manage Devices' })).toBeVisible();
});

test('sheet closes with close, backdrop and web Escape', async ({ page }) => {
  await seed(page);
  await page.goto('/');
  for (const method of ['close', 'backdrop', 'escape']) {
    await page.getByRole('button', { name: 'Insight for You', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close sheet' })).toBeVisible();
    if (method === 'close') await page.getByRole('button', { name: 'Close sheet' }).click();
    else if (method === 'backdrop')
      await page.getByLabel('Dismiss sheet', { exact: true }).click({ position: { x: 10, y: 10 } });
    else {
      await page.waitForTimeout(350);
      await page.keyboard.press('Escape');
    }
    await expect(page.getByRole('button', { name: 'Close sheet' })).toHaveCount(0);
  }
});

test('desktop shell provides sidebar navigation and responsive layout', async ({ page }) => {
  await seed(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.getByRole('tab', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByText('Medivo Health OS', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Insights', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Key Metrics' })).toBeVisible();
  await page.getByRole('tab', { name: 'Profile', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Alex/ })).toBeVisible();
  await page.screenshot({ path: path.join(output, 'desktop-profile-1440.png') });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('tab', { name: 'Profile', exact: true })).toBeVisible();
});
