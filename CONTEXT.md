# Proyecto de Apoyo Psicológico

Una aplicación web de Next.js para servicios de apoyo psicológico y acompañamiento.

## Filosofía del Proyecto

**SIMPLICIDAD Y MINIMALISMO ANTE TODO**

El proyecto se basa en principios de simplicidad extrema:

- **Fácil de entender**: Código que cualquier desarrollador pueda leer y comprender rápidamente
- **Mantenible**: Cambios y actualizaciones deben ser simples de implementar
- **Sin complicaciones**: Evitar sobre-ingeniería, abstracciones innecesarias o patrones complejos
- **Clean Code**: Código limpio, bien nombrado, con responsabilidades claras
- **Sin redundancia**: DRY (Don't Repeat Yourself) - reutilizar en lugar de duplicar
- **Compacto**: Preferir soluciones concisas sin sacrificar claridad
- **Menos líneas, más valor**: Código que hace lo necesario sin verbosidad
- **Buenas prácticas**: Seguir estándares de la industria de forma práctica, no dogmática
- **Diseño minimalista**: UI/UX funcional sin elementos decorativos excesivos

**IMPORTANTE**:
- Si algo se puede hacer en 10 líneas en lugar de 50, hacerlo en 10
- Si una solución simple funciona, no buscar una compleja
- Si un componente hace una cosa bien, no hacerlo hacer más
- Si puedes reutilizar, NO copies

## Stack Tecnológico

- **Framework**: Next.js 15.5.3 con App Router
- **React**: 19.1.0
- **TypeScript**: Configuración estricta
- **Estilos**: Tailwind CSS v4
- **Iconos**: react-icons v5.5.0 (NO usar @heroicons)
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Notificaciones**: react-hot-toast
- **Emails**: Resend (envío de emails de contacto)
- **Edge Functions**: Supabase Edge Functions (backend serverless)
- **Analytics**: Google Tag Manager
- **SEO**: Metadata App Router + robots/sitemap nativos

## Comandos Importantes

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Linting
npm run lint

# Iniciar en producción
npm run start
```

## Convenciones de Código

### Componentes
- TypeScript obligatorio, PascalCase: `FAQ.tsx`, `AboutMe.tsx`
- `'use client'` solo cuando sea necesario
- Functional components con hooks

### TypeScript y ESLint

**Reglas IMPORTANTES que Vercel valida:**

1. **Sin `any` explícitos**:
   ```tsx
   ❌ Malo:
   setAll: (cookies: any) => { ... }
   
   ✅ Bien:
   type CookieSetOptions = { name: string; value: string; options?: Record<string, unknown> };
   setAll: (cookies: CookieSetOptions[]) => { ... }
   ```

2. **Dependencias de hooks**:
   ```tsx
   ❌ Malo:
   const handleClick = useCallback(() => {
     console.log(user.id); // Usa user pero no está en deps
   }, []); // Falta user en dependencias
   
   ✅ Bien:
   const handleClick = useCallback(() => {
     console.log(user?.id);
   }, [user?.id]); // Incluida en dependencias
   ```

3. **Antes de hacer push/commit**:
   ```bash
   npm run lint   # Verifica errores ESLint
   npm run build  # Verifica compilación TypeScript
   ```

**Si Vercel rechaza el build:**
- Leer el error completo: qué archivo, qué línea
- Fijar localmente primero con `npm run lint`
- Commit y push una vez que `npm run build` pase exitosamente

### Iconos
- **SOLO** `react-icons`: `import { FaChevronDown } from 'react-icons/fa'`
- **NUNCA** @heroicons ni lucide-react

### Estilos
- **SOLO** Tailwind CSS v4
- **NUNCA** `style={{}}` (excepción: `var()` para colores CSS)
- Mobile-first, paleta consistente

### Paleta de Colores (ver globals.css)
```
--color-primary: #F2A2B1 (Rosa principal - para decoraciones)
--color-secondary: #BF88AC (Morado - para botones, líneas, iconos)
--color-tertiary: #9B9DBF (Morado/azul claro - para decoraciones)
--color-accent: #4982A6 (Azul - para títulos)
--color-pastel: #F2DCDC (Rosa pastel - para fondos y decoraciones)
--color-pastel-light: #FAF0F0 (Rosa muy claro - para fondos de secciones)
--color-tertiary-light: #E8E9F5 (Lavanda claro - para fondos de secciones)
```

### Uso de Colores
- **Fondos de secciones**: Usar colores claros (`bg-pastel-light`, `bg-tertiary-light`) alternando para crear contraste visual
- **Títulos principales**: `text-accent` con `font-libre-baskerville`
- **Iconos interactivos**: `style={{color: 'var(--color-secondary)'}}` (único caso aceptado de style inline)
- **Botones CTA**: `backgroundColor: 'var(--color-secondary)'` (único caso aceptado de style inline)
- **Elementos decorativos (bolitas)**: `bg-primary`, `bg-pastel`, `bg-secondary`, `bg-tertiary` con opacidades bajas (15-25%)
- **Líneas decorativas**: `bg-secondary`
- **Principio**: Los colores intensos para acentos, los colores claros para fondos

### Títulos y Decoración
- **TODOS los títulos deben tener línea decorativa**
- Formato: `<div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>`
- Posición: Inmediatamente después del título, antes del contenido/párrafo
- Consistencia: Usar en todas las secciones principales

### Estructura de Archivos
```
src/
├── app/              # App Router de Next.js
│   ├── login/        # Página de inicio de sesión
│   ├── registro/     # Página de registro
│   ├── agendar-cita/ # Página para agendar citas (protegida)
│   ├── blog/         # Sistema de blog
│   ├── contactame/   # Página de contacto
│   └── api/          # API Routes de Next.js
├── components/       # Componentes reutilizables
├── lib/              # Utilidades y configuraciones
│   └── supabase.ts   # Cliente de Supabase
└── ...

public/               # Archivos estáticos (TODOS los recursos van aquí)
└── images/
    ├── blog/
    │   └── [slug]/   # Carpeta por artículo
    │       └── portada.jpg
    ├── carrusel_1.jpg
    └── ...
```

**IMPORTANTE**: TODOS los archivos estáticos (imágenes, PDFs, fonts) van en `public/`. Next.js sirve automáticamente estos archivos desde la raíz del dominio.

## SEO e Indexación

- **Dominio canónico**: `https://tupsicoana.com` (sin www, cubierto por Domain Property en GSC)
- **Favicon**: `src/app/icon.png` y `src/app/favicon.ico` - Logo azul grisáceo (ψ, letra psi de psicología)
  - Next.js genera automáticamente todos los tamaños necesarios (16x16, 32x32, etc.)
  - El archivo `.png` tiene prioridad sobre `.ico` en navegadores modernos
- **robots.txt**: `src/app/robots.ts` (generado dinámicamente, excluye `/api`, `/admin`, `/login`, `/registro`, `/reset-password`)
- **sitemap.xml**: `src/app/sitemap.ts` (listado de URLs públicas para indexación)
- **Verificación Google**: `metadata.verification` en `src/app/layout.tsx`
- **Viewport**: usar `export const viewport`, no dentro de `metadata`
- **Google Search Console**: Registrar como Domain Property (`tupsicoana.com`), verificar por DNS

## Analytics y Seguimiento

### Google Tag Manager (GTM)
- **Contenedor**: `GTM-K9V937TH`
- **Instalación**: En `src/app/layout.tsx`
  - Script en `<head>` con `strategy="afterInteractive"`
  - Noscript iframe en `<body>` para usuarios sin JavaScript
- **Calidad**: Contenedor funcionando correctamente, enviando datos sin problemas
- **Gestión**: [tagmanager.google.com](https://tagmanager.google.com)
  - Todas las etiquetas y configuraciones se manejan desde la interfaz web de GTM
  - No requiere cambios en el código para agregar nuevas etiquetas

### Google Analytics 4 (GA4)
- **ID de medición**: `G-18WMEJK6Z9`
- **Implementación**: Vía Google Tag Manager (no código directo)
- **Configuración en GTM**:
  - Tipo de etiqueta: "Etiqueta de Google" (Google tag)
  - Activador: "All Pages" (todas las páginas)
  - Nombre de etiqueta: "GA4 - Configuración"
- **Verificación**: Informes → Tiempo real en [analytics.google.com](https://analytics.google.com)
- **Datos disponibles**:
  - Usuarios en tiempo real y estadísticas de visitas
  - Páginas más visitadas
  - Ubicación geográfica (países, ciudades)
  - Dispositivos y navegadores
  - Tiempo de permanencia en el sitio

### Beneficios de GTM
- **Flexibilidad**: Agregar/modificar etiquetas sin redesplegar el sitio
- **Centralización**: Todas las herramientas de marketing en un solo lugar
- **Sin cambios de código**: Las actualizaciones se hacen desde la interfaz de GTM
- **Vista previa**: Probar cambios antes de publicar
- **Historial de versiones**: Rollback fácil si algo falla

## Funcionalidades del Proyecto

### Componentes Públicos
- **Carousel**: Carrusel de imágenes con navegación
- **AboutMe**: Sección sobre el profesional (parametrizable: showButton, bgColor)
- **WhyChooseMe**: Sección "¿Por Qué Elegirme?" con 3 características
- **TherapyServices**: Servicios de acompañamiento con tarjetas
- **PhotoGallery**: Galería de fotos con lightbox y navegación
- **FAQ**: Preguntas frecuentes colapsables con animaciones suaves (700ms), fade in/out y rotación de ícono
- **BlogCard**: Tarjeta de artículo de blog con imagen, categoría, fecha y excerpt
- **BlogSection**: Sección de blog para página principal (muestra últimos artículos)
- **ContactForm**: Formulario de contacto reutilizable (parametrizable: showImage, variant)
- **Footer**: Enlaces sociales y información de contacto
- **Header/Navigation**: Navegación principal con icono de usuario
- **Toaster**: Sistema de notificaciones unificado con react-hot-toast

### Sistema de Autenticación
- **Registro** (`/registro`): Crear cuenta con nombre completo, email y contraseña
- **Login** (`/login`): Iniciar sesión con email y contraseña
- **Perfil progresivo**: Los datos del usuario se completan gradualmente en la primera cita
- **Protección de rutas**: Páginas que requieren autenticación redirigen a login

### Sistema de Citas
- **Agendar Cita** (`/agendar-cita`): Formulario para agendar citas (requiere autenticación)
  - **Modo Normal**: Solicita nombre, fecha de nacimiento, género (solo primera vez)
  - **Modo Anónimo**: No solicita datos personales
  - Tipo de problema: pareja, ansiedad, emociones, "no sé"
  - Modalidad: videollamada o chat
  - Fecha y hora de preferencia
  - Duración: 20 minutos por consulta

### Sistema de Contacto
- **Formulario de contacto** (`/contactame`): Permite a visitantes enviar mensajes
  - Campos: nombre, email, teléfono (opcional), mensaje
  - Validación de campos obligatorios
  - Envío de emails vía Resend usando Supabase Edge Functions
  - Email del destinatario oculto (protegido en variables de entorno)
  - Notificaciones toast de confirmación
  - También disponible como sección en página principal
- **Tecnología**:
  - Frontend: React Hook Form en `ContactForm.tsx`
  - API Route: `/api/send-contact` (Next.js API)
  - Backend: Supabase Edge Function `send-contact-email`
  - Envío: Resend API (100 emails/día gratis)
  - Variables de entorno: `RESEND_API_KEY`, `CONTACT_EMAIL`

### Sistema de Blog
- **Página de blog** (`/blog`): Lista todos los artículos publicados
  - Grid responsive que se centra automáticamente según cantidad de artículos
  - Muestra los 3 posts más recientes ordenados por fecha descendente
  - 1 artículo: centrado, 2 artículos: dos columnas centradas, 3+: grid completo
- **Artículos individuales** (`/blog/[slug]`): Página completa del artículo
  - Diseño limpio con tipografía legible
  - Imagen de portada optimizada con next/image y responsive sizing
  - Categoría, fecha y autor
  - Call-to-action al final para agendar cita
  - Botón "Volver al blog"
- **Componentes**:
  - `BlogCard`: Tarjeta con título completo, excerpt limitado a 3 líneas, imagen optimizada
  - `BlogSection`: Muestra últimos 3 posts en página principal (reutiliza BlogCard)
- **Estructura de archivos**:
  ```
  src/app/blog/
  ├── page.tsx                    # Lista de artículos
  └── [slug]/
      └── page.tsx                # Artículo individual

  public/images/blog/
  └── [slug]/
      ├── amorpropio.jpeg         # Imagen principal (nombre descriptivo)
      └── imagen-*.jpg            # Imágenes adicionales (opcional)
  ```
- **Mejores prácticas**:
  - Cada artículo tiene su propia carpeta de imágenes
  - Slug del artículo = nombre de carpeta de código e imágenes
  - Nombres de imagen descriptivos (ej: amorpropio.jpeg, no portada.jpg)
  - Agregar artículos nuevos al array `blogPosts` en:
    - `src/app/blog/page.tsx` (listado general)
    - `src/components/BlogSection.tsx` (sección del index)
  - Ambos archivos ordenan por fecha descendente automáticamente
  - Metadata y JSON-LD para SEO en cada post
- **Publicación de nuevo artículo**:
  1. Crear carpeta: `public/images/blog/[slug]/`
  2. Subir imagen descriptiva (ej: amorpropio.jpeg)
  3. Crear archivo: `src/app/blog/[slug]/page.tsx`
  4. Añadir entrada a `blogPosts` array (ambos archivos)
  5. Incluir metadata y JSON-LD
  6. Commit: `feat: agregar artículo de blog [título]`

## Principios de Diseño

1. **Minimalismo**: Menos es más - reducir elementos decorativos al mínimo necesario
2. **Espaciado**: Dar espacio para que el contenido respire
3. **Consistencia de colores**: Alternar fondos claros entre secciones para crear ritmo visual
4. **Jerarquía visual**: Títulos prominentes con líneas decorativas
5. **Bolitas decorativas**: Máximo 6-8 por sección, con opacidades bajas (15-25%)

## Idioma

- **UI/UX**: 100% español (textos, títulos, contenido)
- **Código**: Inglés (variables, funciones, archivos)
- **Mensajes de error y toasts**: Siempre en español. Usa `translateSupabaseError(error, fallback)` (`src/lib/errorMessages.ts`) para traducir respuestas de Supabase antes de mostrarlas al usuario.

## Notificaciones

### Sistema Unificado con react-hot-toast
- **Componente**: `Toaster.tsx` en el layout principal
- **Estilos personalizados** con la paleta de colores del proyecto
- **Tipos de notificaciones**:
  - ✅ **Success**: Fondo rosa pastel, borde morado secundario
  - ❌ **Error**: Fondo rojo claro, borde rojo
  - ⏳ **Loading**: Fondo lavanda claro, borde morado terciario
- **Uso**: `import toast from 'react-hot-toast'`
  - `toast.success('Mensaje de éxito')`
  - `toast.error('Mensaje de error')`
  - `toast.loading('Cargando...')`

### Casos de Uso
- Login/registro exitoso, verificación email
- Validación de campos y contraseñas
- Confirmación de citas agendadas
- Errores en procesos

## Supabase

### Configuración
- **Variables de entorno** (`.env.local`):
  - `NEXT_PUBLIC_SUPABASE_URL`: URL del proyecto
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima pública (para frontend)
  - `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio (solo para scripts admin, NO commitear)
  - `RESEND_API_KEY`: API key de Resend para emails
  - `CONTACT_EMAIL`: Email destino para formulario de contacto
- **Cliente**: `src/lib/supabase.ts`
- **IMPORTANTE**: `.env.local` está en `.gitignore` por seguridad

### Convenciones de Base de Datos
- Snake_case para tablas y columnas: `user_profiles`, `created_at`
- Nombres claros y descriptivos, singular preferido
- Simplicidad ante over-engineering
- Timestamps: `created_at`, `updated_at` siempre
- Foreign keys claras: `user_id`, `appointment_id`
- Enums para roles y estados

### Triggers y Automatización
- **Creación automática de perfiles**: Trigger `on_auth_user_created` en `auth.users`
  - Cuando se registra un usuario en auth, automáticamente se crea su perfil en `profiles`
  - Rol por defecto: `patient`
  - Extrae `full_name` de `raw_user_meta_data`
  - SQL: `supabase/migrations/001_create_profiles_trigger.sql`
- **Sincronización**: Si existen usuarios sin perfil, ejecutar PARTE 2 del SQL de migración

### Autenticación
- **user_metadata** almacena:
  - `full_name`: Nombre completo del usuario
  - `birthdate`: Fecha de nacimiento (se agrega en primera cita)
  - `gender`: Género (se agrega en primera cita)

### Sistema de Roles
- **3 tipos de cuenta**:
  - `admin`: Administrador con control total del sistema (actualizar rol manualmente en BD)
  - `psychologist`: Psicólogo que gestiona citas y pacientes (actualizar rol manualmente en BD)
  - `patient`: Paciente/usuario que agenda citas (rol por defecto al registrarse)
- **Tabla `profiles`**: Extiende auth.users con información adicional y rol
- **Registro público** (`/registro`):
  - Crea usuario en `auth.users` con metadata (full_name, birthdate, gender)
  - Trigger automático crea perfil en `profiles` con rol 'patient'
  - No necesita código adicional para crear perfil
- **Admin y psicólogos**: Crear usuario normal, luego actualizar `role` en tabla `profiles` vía SQL Editor

### Gestión de Sesión
- Header detecta automáticamente el estado de autenticación
- Dropdown con nombre del usuario y opción de cerrar sesión
- Redirección automática a login si no está autenticado
- Protección de rutas según rol de usuario

## Mejores Prácticas

1. **Accesibilidad**: Incluir aria-labels en botones interactivos
2. **Performance**: Usar Next.js Image component para imágenes
3. **Responsive**: Probar en móvil, tablet y desktop
4. **TypeScript**: Definir interfaces para props complejas
5. **Idioma**: Todo el contenido en español
6. **Notificaciones**: Usar toast para feedback al usuario en todas las acciones importantes
7. **Autenticación**: Verificar siempre el estado del usuario antes de operaciones sensibles

## Git y Control de Versiones

### Commits
- **Formato**: Usar Conventional Commits en español (feat, fix, refactor, docs, style, etc.)
- **Mensajes**: Título conciso + lista detallada de cambios en español
- **NO incluir**: Firmas automáticas de herramientas de IA
- **Idioma**: Todo en español

### Ejemplo de commit:
```bash
feat: agregar formulario de contacto con integración de email

- Agregar componente ContactForm con validación de campos
- Crear página /contactame con título centrado
- Integrar API de Resend para envío de emails
- Configurar Edge Function en Supabase
```

## Verificación

Antes de finalizar cualquier cambio:
1. Ejecutar `npm run lint` para verificar código
2. Ejecutar `npm run build` para verificar compilación (toma tiempo, solo si es necesario)
3. Probar responsive design
4. Verificar accesibilidad básica

## Debugging y Diagnóstico

### Logs de Disponibilidad
- La página `/agendar-cita` incluye logs en consola del navegador para diagnosticar problemas
- Logs incluyen: datos de BD, ventana de agendamiento, fechas/horarios generados
- Abrir DevTools (F12) → Console para ver información de debug

### Scripts de Verificación (requiere SUPABASE_SERVICE_ROLE_KEY)
- Scripts temporales pueden crearse para verificar estado de BD
- Usar service_role key para bypasear RLS
- Nunca commitear archivos con credenciales
