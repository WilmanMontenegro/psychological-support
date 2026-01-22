# Apoyo Psicológico

Aplicación web para servicios de apoyo psicológico y acompañamiento online.

## Stack

- **Next.js 15** con App Router
- **React 19** + TypeScript
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **Resend** (emails transaccionales)

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
RESEND_API_KEY=tu_api_key_de_resend
CONTACT_EMAIL=email_destinatario_contacto
```

## Estructura del Proyecto

```
src/
├── app/                # Páginas (App Router)
│   ├── login/          # Autenticación
│   ├── registro/
│   ├── agendar-cita/   # Agendar citas (protegida)
│   ├── blog/           # Sistema de blog
│   ├── contactame/     # Formulario de contacto
│   └── api/            # API Routes
├── components/         # Componentes reutilizables
└── lib/                # Utilidades y configuración
```

## Funcionalidades

- **Autenticación** - Registro/login con Supabase Auth
- **Sistema de citas** - Agendar consultas con modalidad anónima opcional
- **Blog** - Artículos sobre salud mental con imágenes optimizadas (next/image)
  - Listado dinámico de posts ordenados por fecha
  - Sección destacada en el index con los 3 posts más recientes
  - Metadata y structured data (JSON-LD) para SEO
- **Contacto** - Formulario con envío de emails vía Resend
- **Roles** - Paciente, psicólogo y administrador

## SEO e Indexación

- **Dominio canónico**: `https://www.tupsicoana.com`
- **robots.txt**: generado por `src/app/robots.ts`
- **sitemap.xml**: generado por `src/app/sitemap.ts`
- **Favicon**: `src/app/favicon.ico` (Next.js lo sirve automáticamente)
- **Verificación Google**: meta‑tag en `src/app/layout.tsx`
- **Viewport**: se define con `export const viewport` (recomendación Next.js)

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | Verificar código |
| `npm run start` | Ejecutar build |

## Licencia

Proyecto privado. Todos los derechos reservados.
