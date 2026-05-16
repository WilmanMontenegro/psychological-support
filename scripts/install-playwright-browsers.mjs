/**
 * Evita instalar Chromium de Playwright en Vercel u otros entornos
 * donde las pruebas E2E no se ejecutan.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

if (process.env.VERCEL === '1' || process.env.SKIP_PLAYWRIGHT_INSTALL === '1') {
  process.exit(0);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cli = join(root, 'node_modules/playwright/cli.js');

const result = spawnSync(process.execPath, [cli, 'install', 'chromium'], {
  stdio: 'inherit',
  cwd: root,
});

process.exit(result.status ?? 1);
