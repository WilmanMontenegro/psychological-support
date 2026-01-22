# Flujo de trabajo Git

## Principios

- Mantener el historial claro y con commits pequeños.
- Preferir ramas para cambios grandes o riesgosos.
- Permitir commits directos a `main` para ajustes mínimos.

## ¿Cuándo usar ramas?

Usar una rama nueva cuando el cambio:

- agrega una funcionalidad completa,
- implica refactor grande,
- toca varias áreas sensibles,
- requiere revisión antes de merge.

Ejemplo:

```bash
git checkout -b feature/nombre-corto
```

## ¿Cuándo ir directo a `main`?

Se permite commit directo a `main` cuando el cambio:

- es pequeño y localizado,
- no rompe APIs,
- corrige detalles visuales o de contenido,
- actualiza documentación.

## Convención de commits

- **Prefijo en inglés** (Conventional Commits)
- **Mensaje en español**, corto y en imperativo

Format:

```
<tipo>: <mensaje>
```

Tipos permitidos:

- `feat` — nueva funcionalidad
- `fix` — corrección de bug
- `docs` — documentación
- `style` — formato/estilo (sin cambios de lógica)
- `refactor` — refactorización
- `perf` — mejoras de rendimiento
- `test` — pruebas
- `build` — build/dependencias
- `ci` — CI/CD
- `chore` — mantenimiento general
- `revert` — reversión

Ejemplos:

- `feat: agregar agenda de citas`
- `fix: corregir favicon en producción`
- `docs: actualizar guía de SEO`

## Notas

- Si hay duda, crear rama.
- Si el cambio es mínimo, es válido ir directo a `main`.
