/**
 * Rutas públicas estáticas: humo E2E, comprobaciones de salud y alineación con sitemap.
 * Añadir aquí nuevas páginas estáticas antes de duplicar paths en tests.
 */
export const PUBLIC_STATIC_ROUTES = [
  '/',
  '/blog',
  '/eventos',
  '/contactame',
  '/sobre-mi',
  '/privacidad',
  '/login',
] as const;

/** Rutas legacy de citas; deben redirigir a /blog (ver next.config.ts). */
export const CLINICAL_LEGACY_ROUTES = [
  '/agendar-cita',
  '/mis-citas',
  '/mi-disponibilidad',
] as const;

export type PublicStaticRoute = (typeof PUBLIC_STATIC_ROUTES)[number];
