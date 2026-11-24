import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 2,
  timeout: 120000,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5181', screenshot: 'only-on-failure' },
  webServer: {
    command: 'npm run preview:local -- --port 5181 --strictPort',
    url: 'http://127.0.0.1:5181/game.html',
    reuseExistingServer: !process.env.CI,
  },
});
