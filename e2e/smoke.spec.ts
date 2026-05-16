import { expect, test } from '@playwright/test';
import {
  CLINICAL_LEGACY_ROUTES,
  PUBLIC_STATIC_ROUTES,
} from '../src/lib/publicRoutes';

for (const path of PUBLIC_STATIC_ROUTES) {
  test(`página ${path} responde OK`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response, `sin respuesta para ${path}`).toBeTruthy();
    expect(response!.ok(), `status ${response!.status()} para ${path}`).toBeTruthy();
  });
}

test('/eventos muestra aviso muy pronto y tono educativo', async ({ page }) => {
  await page.goto('/eventos');
  await expect(page.getByRole('heading', { level: 1, name: 'Eventos' })).toBeVisible();
  await expect(page.getByText('Muy pronto')).toBeVisible();
  await expect(
    page.getByText(/no ofrece acompañamiento psicológico|terapia|consultas clínicas/i)
  ).toBeVisible();
});

for (const path of CLINICAL_LEGACY_ROUTES) {
  test(`${path} redirige a /blog`, async ({ page }) => {
    await page.goto(path);
    await page.waitForURL(/\/blog/);
  });
}

test('/blog muestra título principal', async ({ page }) => {
  await page.goto('/blog');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Blog de Bienestar Emocional' })
  ).toBeVisible();
});
