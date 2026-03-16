---
applyTo: "**/*"
description: "Usar cuando se preparen cambios para commit/push: aplicar versionado semántico, commits atómicos y validaciones mínimas antes de integrar."
---

# Flujo de control de versiones

## Commits
- Commits pequeños y atómicos, con mensaje en formato `<tipo>: <acción en imperativo>`.
- Tipos preferidos: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`.
- Evitar mezclar cambios funcionales y refactors grandes en el mismo commit.

## Calidad previa a integración
- Ejecutar `npm run lint` antes de cerrar una tarea.
- Ejecutar `npm run build` antes de push a `main`.
- Si hay errores no relacionados, reportarlos sin modificar alcance.

## Versionado
- Seguir SemVer.
- Si cambia comportamiento visible o API interna relevante, sugerir actualización de versión y entrada en `CHANGELOG.md`.

## Seguridad de repositorio
- No versionar secretos, claves o tokens.
- Verificar `.gitignore` para archivos sensibles (`.env*`, credenciales JSON, etc.).
