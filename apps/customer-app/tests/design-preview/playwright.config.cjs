const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: __dirname,
  testMatch: '*.spec.cjs',
  timeout: 30000,
  workers: 1,
  reporter: 'list',
  outputDir: '/tmp/medivo-native-checks/test-results',
  use: {
    baseURL: process.env.DESIGN_BASE_URL || 'http://127.0.0.1:5174',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  },
  webServer: {
    command: `node "${__dirname}/serve-export.cjs"`,
    url: 'http://127.0.0.1:5174',
    reuseExistingServer: true,
  },
});
