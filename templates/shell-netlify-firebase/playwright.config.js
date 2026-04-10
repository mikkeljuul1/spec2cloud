import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:8888',
    headless: true,
  },
  webServer: {
    command: 'npx netlify dev',
    port: 8888,
    reuseExistingServer: true,
  },
});
