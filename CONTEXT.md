# Proyecto de Apoyo Psicológico

Una aplicación web minimalista para servicios de apoyo psicológico y acompañamiento.

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
- **Auth**: Supabase Auth
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
- **Categorías**: Clasificación por temas (Maternidad, Autoestima, etc.).

### 4. Interfaz Adaptativa
- **Diseño Mobile-First**: Alturas calculadas (`calc(100vh - X)`) para evitar scroll innecesario en móviles.
- **Minimalismo**: Botones y acciones contextuales que solo aparecen cuando son necesarios.

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
```

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

## Despliegue

- **Hosting**: Vercel (Automático desde `main`)
- **Dominio**: `www.tupsicoana.com`
