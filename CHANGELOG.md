# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.2] - 2026-02-19

### Added
- **New Blog Post**: "La ilusión de las redes sociales" - Artículo sobre el uso consciente de redes y el bienestar mental.

## [1.1.1] - 2026-02-12

### Added
- **New Blog Post**: "Cómo decir NO sin sentirte culpable" - Artículo sobre límites saludables y amor propio.
- **Database Migrations**: Estructura de migraciones en `supabase/migrations/` para gestión de versiones de BD.
- **Enhanced Error Handling**: Mejores mensajes de error en el sistema de likes (detección de tabla no existente, permisos RLS).

### Fixed
- **Comment Likes Error Handling**: Errores más específicos al dar like (tabla no existe, permisos, duplicado).

### Changed
- **Blog Post Structure**: Todos los posts seguir ahora un patrón consistente con subtítulos, énfasis visual (cajas resaltadas) y mejor legibilidad.

## [1.1.0] - 2026-02-05

### Added
- **Comment Likes**: Sistema de likes para comentarios del blog con corazones.
- **OAuth Callback**: Ruta de callback para autenticación con Google OAuth.
- **RLS Policies**: Políticas de seguridad para lectura pública de nombres de perfiles y likes.

### Fixed
- **Login Redirect**: El login ahora redirige correctamente al blog desde donde se inició sesión.
- **Comment Profiles**: Los comentarios ahora muestran correctamente el nombre del usuario.
- **Share Buttons**: Mejorada la captura de URL para botones de compartir.

### Changed
- **Comment UI**: Rediseño de tarjetas de comentarios con mejor estilo visual (sombras, bordes, gradientes).
- **Social Links**: Actualizados enlaces de Instagram y Facebook a @tupsicoana.
- **Error Handling**: Mensajes de error más específicos en el sistema de comentarios.

## [1.0.0] - 2026-02-05

### Added
- **Blog Comments**: Full comments system implementation with Supabase.
- **Google Login**: Authentication via Google OAuth for users.
- **Privacy Policy**: New page at `/privacidad` for legal compliance.
- **New Blog Post**: "¿Cuándo ir al psicólogo?".
- **Security**: Row Level Security (RLS) policies for comments.

### Changed
- **Image Structure**: Refactored blog images to a flat structure for better management.
- **UI**: Added TikTok icon to footer.
- **Documentation**: Updated README and CONTEXT with project structure.

## [0.1.0] - 2026-01-01
### Added
- Initial release of the website.
- Home page, About page, and Blog section.
- Appointment scheduling integration.
