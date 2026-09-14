const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const output = '/tmp/medivo-native-checks/screenshots';
fs.mkdirSync(output, { recursive: true });
const fixture = {
  state: {
    user: {
      id: 'preview-test',
      name: 'Test Session',
      email: 'test@example.invalid',
      skinType: 'Combination',
      hipaaConsent: false,
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
test('sign-in destinations and preview authentication guard', async ({ page }) => {
  await page.goto('/design');
  await expect(page).toHaveURL(/\/login$/);
  await seed(page);
  await page.goto('/');
  await expect(page).toHaveURL(/\/design$/);
  await expect(page.getByRole('heading', { name: 'Good morning, Aanya' })).toBeVisible();
});
test('onboarding remains required', async ({ page }) => {
  await seed(page, false);
  await page.goto('/design');
  await expect(page).toHaveURL(/\/onboarding$/);
});
test('all preview routes render without API requests at both widths', async ({ page }) => {
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
      await page.goto('/design' + (route ? '/' + route : ''));
      await expect(page.getByRole('heading').first()).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.screenshot({ path: `${output}/${route || 'home'}-${width}.png` });
    }
  }
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});
test('carousel, insight and alert sheets, and metric period', async ({ page }) => {
  await seed(page);
  await page.goto('/design');
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
  await page.getByRole('tab', { name: 'Go to slide 2' }).click();
  await expect(page.getByRole('tab', { name: 'Go to slide 2' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.screenshot({ path: `${output}/insights-sheet.png` });
  await page.getByRole('button', { name: 'Got it', exact: true }).click();
  await page.getByRole('button', { name: 'View details', exact: true }).click();
  await page.screenshot({ path: `${output}/alert-sheet.png` });
  await page.getByRole('button', { name: 'View details', exact: true }).click();
  await expect(page).toHaveURL(/metric-details/);
  await tab(page, 'Insights').click();
  await tab(page, 'Month').click();
  await expect(tab(page, 'Month')).toHaveAttribute('aria-selected', 'true');
});
test('care state survives tab navigation and date/collapse controls work', async ({ page }) => {
  await seed(page);
  await page.goto('/design/care');
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
test('scan consent, sample upload, profile edit, device connection', async ({ page }) => {
  await seed(page);
  const requests = [];
  await page.route('**/api/**', (r) => {
    requests.push(r.request().url());
    return r.fulfill({ json: {} });
  });
  await page.goto('/design/scan');
  await page.getByRole('button', { name: 'Begin Face Scan' }).click();
  await expect(page.getByRole('button', { name: 'Start simulated scan' })).toHaveAttribute(
    'aria-disabled',
    'true',
  );
  await page.getByRole('checkbox', { name: 'Agree to simulated scan' }).click();
  await page.getByRole('button', { name: 'Start simulated scan' }).click();
  await expect(page.getByRole('heading', { name: 'Your scan is complete' })).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Upload Photo', exact: true }).click();
  await page.getByRole('radio', { name: 'Sample lab report.pdf' }).click();
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByText('Sample lab report.pdf', { exact: true })).toBeVisible();
  await tab(page, 'Profile').click();
  await page.getByRole('button', { name: 'Edit Profile', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Preview Name');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Preview Name' })).toBeVisible();
  await page.goto('/design/devices');
  await page.getByRole('switch', { name: 'Apple Watch sync' }).click();
  await expect(page.getByRole('switch', { name: 'Apple Watch sync' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Reconnect', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Reconnected (1)' })).toBeVisible();
  await page.getByRole('button', { name: 'Connect Apple Watch', exact: true }).click();
  await page.getByRole('button', { name: 'Connect now', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Apple Watch connected' })).toBeVisible();
  await page.getByRole('button', { name: 'View devices', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Manage Devices' })).toBeVisible();
  expect(requests).toEqual([]);
});
test('existing app stays reachable and preview state resets when leaving', async ({ page }) => {
  await seed(page);
  await page.route('**/api/**', (route) => {
    const url = route.request().url();
    return route.fulfill({ json: url.includes('/profile') ? fixture.state.user : [] });
  });
  await page.goto('/design/profile');
  await page.getByRole('button', { name: 'Edit Profile', exact: true }).click();
  await page.getByLabel('Full name', { exact: true }).fill('Temporary Name');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.getByRole('button', { name: 'Open existing app' }).click();
  await expect(page).not.toHaveURL(/\/design/);
  await page.goto('/profile');
  await page.getByRole('button', { name: 'Open new design' }).click();
  await expect(page).toHaveURL(/\/design$/);
  await tab(page, 'Profile').click();
  await expect(page.getByRole('heading', { name: 'Prateek Gautam' })).toBeVisible();
});

test('successful login uses the new destination', async ({ page }) => {
  await page.route('**/api/**', (r) =>
    r.fulfill({ json: { data: { token: fixture.state.token, user: fixture.state.user } } }),
  );
  await page.goto('/login');
  await page.getByPlaceholder('Email address', { exact: true }).fill('test@example.invalid');
  await page.getByPlaceholder('Password', { exact: true }).fill('test-password');
  await page.getByText('Sign In', { exact: true }).click();
  await expect(page).toHaveURL(/\/design$/);
});
test('onboarding completion uses the new destination', async ({ page }) => {
  await seed(page, false);
  await page.goto('/onboarding');
  await page.getByText('Complete Profile & Enter Dashboard', { exact: true }).click();
  await expect(page).toHaveURL(/\/design$/);
});
test('sheet closes with close, backdrop and web Escape', async ({ page }) => {
  await seed(page);
  await page.goto('/design');
  for (const method of ['close', 'backdrop', 'escape']) {
    await page.getByRole('button', { name: 'Insight for You', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close sheet' })).toBeVisible();
    if (method === 'close') await page.getByRole('button', { name: 'Close sheet' }).click();
    else if (method === 'backdrop')
      await page.getByLabel('Dismiss sheet', { exact: true }).click({ position: { x: 10, y: 10 } });
    else {
      // RN Web activates Escape handling after its 300ms modal entrance transition.
      await page.waitForTimeout(350);
      await page.keyboard.press('Escape');
    }
    await expect(page.getByRole('button', { name: 'Close sheet' })).toHaveCount(0);
  }
});

test('desktop preview uses the desktop shell without changing mobile routes', async ({ page }) => {
  await seed(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/design');
  await expect(page.getByRole('tab', { name: 'Home', exact: true })).toBeVisible();
  await expect(page.getByText('Design preview', { exact: true })).toBeVisible();
  await page.getByRole('tab', { name: 'Insights', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Key Metrics' })).toBeVisible();
  await page.getByRole('tab', { name: 'Profile', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Open existing app' })).toBeVisible();
  await page.screenshot({ path: `${output}/desktop-profile-1440.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('tab', { name: 'Profile', exact: true })).toBeVisible();
});
