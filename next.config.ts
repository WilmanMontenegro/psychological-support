import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  redirects: async () => [
    // ─── MODO PAUSA (citas desactivadas hasta graduación) ────────────────────
    // Para REACTIVAR: eliminar estos 3 bloques y restaurar las páginas:
    //   - src/app/agendar-cita/page.tsx       → formulario real
    //   - src/app/mis-citas/page.tsx           → panel de citas
    //   - src/app/mi-disponibilidad/page.tsx   → config de disponibilidad
    //   - src/app/api/appointments/[id]/messages/route.ts → handler real
    //   - src/app/auth/callback/route.ts       → fallback "/mis-citas"
    //   - src/app/login/page.tsx               → fallback "/mis-citas"
    //   - src/app/sitemap.ts                   → agregar "/agendar-cita"
    //   - Header.tsx / Navigation.tsx          → restaurar ítems de citas
    // ─────────────────────────────────────────────────────────────────────────
    {
      source: "/agendar-cita",
      destination: "/blog",
      permanent: false,
    },
    {
      source: "/mis-citas",
      destination: "/blog",
      permanent: false,
    },
    {
      source: "/mi-disponibilidad",
      destination: "/blog",
      permanent: false,
    },
    // Aliases externos
    {
      source: "/terapia",
      destination: "/blog",
      permanent: false,
    },
    {
      source: "/cita-psicologica",
      destination: "/blog",
      permanent: false,
    },
    {
      source: "/psicologia",
      destination: "/sobre-mi",
      permanent: true,
    },
    {
      source: "/servicios",
      destination: "/",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubDomains",
        },
      ],
    },
  ],
};

export default nextConfig;
