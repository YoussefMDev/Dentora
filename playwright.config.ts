import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run dev --workspace @dentora/api',
      url: 'http://127.0.0.1:3000/api/health',
      reuseExistingServer: !process.env['CI'],
      env: {
        API_PORT: '3000',
        WEB_ORIGIN: 'http://localhost:4200',
        NODE_ENV: 'test',
      },
    },
    {
      command: 'npm run start --workspace @dentora/web -- --host 127.0.0.1 --port 4200',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: !process.env['CI'],
      timeout: 120_000,
    },
  ],
});
