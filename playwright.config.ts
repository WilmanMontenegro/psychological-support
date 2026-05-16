import { defineConfig, devices } from '@playwright/test';

/**
 * Ejecutar tras `npm run build`. Arranca `next start` en el puerto 3000 si no hay servidor.
 * Local: npm run build && npm run test:e2e
 * CI: establecer CI=true para no reutilizar un servidor huérfano.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'NODE_OPTIONS="${NODE_OPTIONS} --disable-warning=DEP0205" node node_modules/next/dist/bin/next start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
