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

## Stack Tecnológico

- **Framework**: Next.js 15.5.3 con App Router
- **React**: 19.1.0
- **TypeScript**: Configuración estricta
- **Estilos**: Tailwind CSS v4
- **Iconos**: react-icons v5.5.0
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Notificaciones**: react-hot-toast
- **Emails**: Resend (envío de emails de contacto)

## Convenciones de Código

### Componentes y Estilos
- TypeScript obligatorio
- Tailwind CSS v4 para todo el estilizado
- Paleta de colores definida en `globals.css` (primary, secondary, tertiary, accent, pastel)

## Funcionalidades del Proyecto

### Sistema de Citas Simplificado

El flujo de citas se ha optimizado para reducir la fricción:

1.  **Agendamiento**:
    - **Modalidad Única**: Solo **Chat**. Se eliminó la opción de videollamada.
    - **Anónimo**: Opción para ocultar el nombre del paciente al psicólogo (aunque requiere login por seguridad).
    - **Duración**: 20 minutos por sesión.

2.  **Estados de la Cita**:
    - **Pendiente**: Solicitada por el paciente, requiere aceptación.
    - **Confirmada**: Aceptada por el psicólogo.
    - **Cancelada**: Rechazada por el psicólogo, cancelada por el paciente, o marcada como "No realizada".
    - **Finalizada**:
        - **Manual**: El psicólogo la finaliza tras el chat.
        - **Automática**: Si pasa la hora de la cita (+20 min), el sistema la muestra como finalizada visualmente.

3.  **Ventana de Chat (Restricción de Tiempo)**:
    - **Apertura**: 10 minutos antes de la hora programada.
    - **Cierre**: 40 minutos después de la hora de inicio (20 min de sesión + 20 min de margen).
    - **Extensión**: El psicólogo puede extender el tiempo si es necesario.
    - **Admin**: El administrador tiene acceso ilimitado a todos los chats.

4.  **Gestión Post-Cita**:
    - **Feedback**: El psicólogo puede agregar/editar notas clínicas en citas finalizadas.
    - **No Realizada**: El psicólogo puede marcar una cita confirmada como "No realizada" (pasa a Cancelada) si el paciente no asistió.

### Roles de Usuario

- **Patient**: Puede agendar y chatear en su ventana de tiempo.
- **Psychologist**: Gestiona citas, chatea, da feedback y extiende tiempo.
- **Admin**: Control total, puede ver todos los chats y citas sin restricciones de tiempo.

## Estructura de Archivos (Clave)

- `src/app/agendar-cita/`: Formulario de solicitud.
- `src/app/mis-citas/`: Panel principal para pacientes y psicólogos.
- `src/components/AppointmentList.tsx`: Lógica central de estados y botones de acción.
- `src/components/AppointmentChat.tsx`: Componente de chat en tiempo real.

## Despliegue

- **Vercel**: Deploy automático desde rama `main`.
- **Dominio**: `www.tupsicoana.com`