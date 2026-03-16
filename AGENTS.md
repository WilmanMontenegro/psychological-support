# Proyecto de Apoyo Psicológico

Una aplicación web minimalista para servicios de apoyo psicológico y acompañamiento.

## Estado del Proyecto
Actualmente en desarrollo activo.
**Versión Actual**: `1.1.3` (Producción)

## Filosofía del Proyecto

**SIMPLICIDAD Y MINIMALISMO ANTE TODO**

- **Código Limpio**: Fácil de leer, mantener y extender.
- **Sin Redundancia**: DRY (Don't Repeat Yourself).
- **Menos es Más**: Interfaces limpias, sin distracciones.
- **Eficiencia**: Si algo se puede hacer en 10 líneas, no usar 50.

## Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript (Estricto)
- **Estilos**: Tailwind CSS v4
- **Base de Datos**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Google & Email/Password)
- **Notificaciones**: react-hot-toast
- **Emails**: Resend

## Funcionalidades Clave

### 1. Sistema de Citas Simplificado
- **Estados**: 
  - `Pendiente`: Solicitada por el usuario.
  - `Confirmada`: Aceptada por el psicólogo.
  - `Cancelada`: Rechazada o anulada.
  - `Finalizada`: Concluida (automáticamente tras la hora o manualmente).
- **Modalidad**: Chat único (sin videollamada).
- **Anonimato**: Opción visual para pacientes que prefieren discreción.

### 2. Chat Seguro y Restringido
- **Ventana de Tiempo**: 
  - Abre 10 min antes de la cita.
  - Cierra 40 min después del inicio (20 min sesión + 20 min margen).
- **Extensión**: El psicólogo puede añadir +10 min extra si es necesario.
- **Admin God Mode**: El administrador tiene acceso ilimitado a todos los chats y funciones de eliminación.

### 3. Blog de Bienestar
- **Enfoque**: Artículos educativos sobre salud mental.
- **Diseño**: Tarjetas con fecha destacada (estilo calendario minimalista) e imágenes inmersivas.
- **Categorías**: Clasificación por temas (Maternidad, Autoestima, Salud Mental, Bienestar).
- **Comentarios**: Sistema completo con likes, perfiles de usuario y permisos RLS.
- **Interacción**: Los usuarios pueden dar like a comentarios y eliminar sus propios comentarios.
- **SEO Automático**: Sitemap dinámico que se actualiza automáticamente con cada nuevo post.
- **Posts Actuales**: 6 artículos publicados (desde Oct 2025 hasta Feb 2026).
- **Login Contextual**: Al iniciar sesión desde un blog, el usuario regresa al mismo artículo.

### 4. Interfaz Adaptativa
- **Diseño Mobile-First**: Alturas calculadas (`calc(100vh - X)`) para evitar scroll innecesario en móviles.
- **Minimalismo**: Botones y acciones contextuales que solo aparecen cuando son necesarios.
- **Multiidioma**: Selector de idioma ES/EN con Google Translate integrado para visitantes angloparlantes.
- **Responsive**: Todos los componentes optimizados para mobile, tablet y desktop.

### 5. Cumplimiento Legal y SEO
- **Política de Privacidad**: Página dedicada (`/privacidad`) que detalla el tratamiento de datos y procesos de eliminación para cumplimiento con Meta y Google OAuth.
- **Google Search Console**: Verificado mediante registro TXT en DNS (Vercel).
- **Sitemap Dinámico**: Auto-generado en `/sitemap.xml` desde `blogData.ts` para mejor indexación.
- **Meta Tags**: Open Graph, Twitter Cards y SEO optimizado por página.
- **Robots.txt**: Configurado para permitir crawling de bots de búsqueda.

## Estructura de Directorios

```
src/
├── app/              # Rutas (App Router)
│   ├── agendar-cita/ # Formulario
│   ├── mis-citas/    # Panel principal
│   └── ...
├── components/       # Componentes reutilizables
│   ├── AppointmentList.tsx # Lógica de estados
│   ├── AppointmentChat.tsx # Chat tiempo real
│   └── ...
└── lib/              # Utilidades (Supabase, Auth)

public/
└── images/
    └── blog/         # Imágenes de artículos (estructura plana)
```

## Cómo Agregar un Nuevo Post al Blog

### Paso 1: Crear el directorio y archivo del post
```bash
mkdir -p src/app/blog/[slug-del-post]
```

### Paso 2: Crear `page.tsx` con la estructura estándar
- Copiar estructura de cualquier post existente
- Actualizar: title, description, keywords, date, slug
- Escribir contenido con subtítulos (h2), párrafos y cajas destacadas
- Incluir imagen flotante con `float-right` en desktop

### Paso 3: Guardar la imagen
- Ubicación: `public/images/blog/[slug-del-post].jpg`
- Formato recomendado: JPG optimizado (< 2MB)
- Dimensiones sugeridas: 1200x800px

### Paso 4: Actualizar `src/lib/blogData.ts`
- Agregar al inicio del array `blogPosts` (más reciente primero)
- Incluir: slug, title, excerpt, image, category, date

### Paso 5: Verificar
```bash
npm run lint   # Sin errores
npm run build  # Compilación exitosa
```

**¡Listo!** El sitemap se actualiza automáticamente. El nuevo post aparecerá en `/blog` y en `/sitemap.xml`.

## Flujo de Trabajo Git

**Principios**: Historial claro, commits atómicos en español.

### Convención de Commits
Formato: `<tipo>: <mensaje corto en imperativo>`

- `feat`: Nueva funcionalidad
- `fix`: Corrección de errores
- `refactor`: Cambios de código sin cambiar comportamiento
- `docs`: Documentación
- `style`: Estilos y formato
- `chore`: Mantenimiento

**Ejemplo**: `feat: agregar botón de extensión de tiempo`

### Ramas vs Main
- **Main**: Para cambios pequeños, ajustes visuales o documentación.
- **Ramas**: Para funcionalidades grandes o refactors riesgosos.

### Antes de hacer Push
⚠️ **SIEMPRE probar el build local antes de hacer push:**
```bash
npm run build
```
- Verifica que no haya errores de compilación
- Asegura que el código pase el linter de ESLint
- Evita deploys fallidos en Vercel

## Despliegue

- **Hosting**: Vercel (Automático desde `main`)
- **Dominio**: `www.tupsicoana.com`
