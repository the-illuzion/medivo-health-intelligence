const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const output = '/tmp/medivo-ui-review/screenshots';
fs.mkdirSync(output, { recursive: true });
const types = ['heart_rate', 'resting_heart_rate', 'step_count', 'active_energy_burned', 'sleep_analysis', 'heart_rate_variability_sdnn'];
async function setup(page, state = 'connected') {
  await page.addInitScript(() => localStorage.setItem('medivo_auth_session', JSON.stringify({
    state: { user: { id: 'layout-fixture', name: 'Aanya Sharma', email: 'aanya@example.invalid' }, token: 'layout-fixture-only', isAuthenticated: true, isOnboarded: true }, version: 0,
  })));
  await page.route('**/api/**', async route => {
    const url = route.request().url();
    let data = [];
    if (url.includes('/health/connection')) data = state === 'empty' ? null : { provider: 'apple_health', status: 'connected', requestedMetrics: types, lastSyncedAt: new Date().toISOString() };
    if (url.includes('/health/summary')) data = { provider: 'apple_health', period: new URL(url).searchParams.get('period'), metrics: types.map((metricType, i) => ({ metricType, value: [72, 68, 8320, 340, 7.4, 48][i], unit: ['bpm', 'bpm', 'count', 'kcal', 'hr', 'ms'][i], sampleCount: 12, aggregation: 'latest', recordedAt: new Date().toISOString() })) };
    if (url.includes('/routines')) data = [{ id: 'morning', name: 'Morning', timing: 'Morning', steps: [{ id: 'one', title: 'Log breakfast', desc: 'Add a quick note or photo', completed: true }, { id: 'two', title: 'Light activity', desc: '20 minutes of walking or stretching', completed: false }] }];
    if (state === 'error' && url.includes('/health/')) return route.fulfill({ status: 503, json: { success: false, error: 'Connection unavailable. Please try again.' } });
    return route.fulfill({ json: { success: true, data } });
  });
}
for (const width of [390, 768, 1440]) {
  test(`reference layouts stay contained at ${width}px`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.setViewportSize({ width, height: 1000 });
    await setup(page);
    for (const route of ['', 'scan', 'insights', 'care', 'profile', 'devices', 'health-status', 'connect-device', 'metric-details']) {
      await page.goto('/design' + (route ? '/' + route : ''));
      await expect(page.getByRole('heading').first()).toBeVisible();
      await expect(page.getByText('Loading Apple Health readings…')).toHaveCount(0);
      await page.waitForTimeout(200);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      // Detect horizontal clipping inside cards, not just page-level overflow.
      const clipped = await page.evaluate(() => [...document.querySelectorAll('div')].filter(el => {
        const style = getComputedStyle(el);
        return style.borderStyle === 'solid' && parseFloat(style.borderRadius) >= 10 && el.clientWidth > 70 && el.scrollWidth > el.clientWidth + 2 && style.overflowX !== 'scroll' && style.overflowX !== 'auto';
      }).map(el => el.textContent.slice(0, 80)));
      expect(clipped).toEqual([]);
      await page.screenshot({ path: `${output}/${route || 'home'}-${width}.png` });
    }
    expect(errors).toEqual([]);
  });
}
test('health status navigation and metric periods remain usable', async ({ page }) => {
  await setup(page);
  await page.goto('/design');
  await page.getByRole('button', { name: 'Your Health Status', exact: true }).click();
  await expect(page).toHaveURL(/health-status/);
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await expect(page).toHaveURL(/design$/);
  await page.getByRole('tab', { name: 'Insights', exact: true }).click();
  await page.getByRole('tab', { name: 'Week', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Week', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('button', { name: 'Heart Rate details', exact: true }).click();
  await expect(page).toHaveURL(/metric-details/);
});
for (const state of ['empty', 'error']) test(`${state} health state remains explicit`, async ({ page }) => {
  await setup(page, state);
  await page.goto('/design');
  await expect(page.getByText(state === 'empty' ? 'Not connected' : 'Couldn’t load Apple Health data', { exact: true }).first()).toBeVisible();
  await expect(page.getByText('No reading yet', { exact: true })).toHaveCount(6);
  await page.screenshot({ path: `${output}/home-${state}.png` });
});

test('profile sheet opens and closes at mobile and desktop sizes', async ({ page }) => {
  await setup(page);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/design/profile');
    await page.getByRole('button', { name: 'Health Conditions', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close sheet', exact: true })).toBeVisible();
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${output}/sheet-${width}.png` });
    await page.getByRole('button', { name: 'Close sheet', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Close sheet', exact: true })).toHaveCount(0);
  }
});
