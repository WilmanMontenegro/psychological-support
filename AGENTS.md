# AGENTS.md — Guía operativa para agentes/IA

Este archivo define cómo trabajar en este repositorio con cambios pequeños, claros y seguros.

## 1) Propósito del proyecto

Plataforma web minimalista en Next.js para contenido de bienestar emocional, blog y funcionalidades asociadas.

## 2) Perfil técnico

- Framework: Next.js 15 (App Router)
- Lenguaje: TypeScript estricto
- UI: Tailwind CSS v4
- Backend/DB/Auth: Supabase
- Deploy: Vercel
- Dominio canónico: www.tupsicoana.com

## 3) Principios obligatorios

1. Simplicidad y legibilidad primero.
2. Resolver causa raíz, no parches superficiales.
3. Cambios mínimos y enfocados (sin tocar áreas no relacionadas).
4. Reutilizar componentes existentes antes de crear nuevos.
5. Mantener coherencia visual (mobile-first, UI limpia, sin adornos extra).

## 4) Reglas para agentes

- No inventar features fuera de lo solicitado.
- No hardcodear secretos ni credenciales.
- No introducir nuevos patrones visuales sin necesidad.
- Evitar refactors grandes si el usuario pidió ajuste puntual.
- Reportar blockers reales en vez de asumir comportamientos.

## 5) Flujo de trabajo recomendado

1. Entender el alcance exacto del pedido.
2. Ubicar archivo/componente objetivo.
3. Implementar el cambio mínimo necesario.
4. Validar localmente.
5. Entregar resumen breve: qué cambió, dónde y cómo validar.

## 6) Validación mínima antes de cerrar

```bash
npm run lint
```

Si el cambio toca rutas, layout, metadata o componentes principales:

```bash
npm run build
```

## 7) Convención de commits

Formato:

```text
<tipo>: <acción en imperativo>
```

Tipos recomendados: feat, fix, refactor, docs, style, chore.

Ejemplos:

- fix: corregir render de selector de idioma
- docs: actualizar guía de agentes

## 8) Estructura útil del repo

- src/app: rutas y metadata
- src/components: componentes reutilizables
- src/lib: utilidades y acceso a datos
- public/images: assets estáticos
- supabase/migrations: cambios de base de datos

## 9) Tareas frecuentes

### Agregar un post al blog

1. Crear ruta en src/app/blog/[slug]/page.tsx
2. Guardar imagen en public/images/blog
3. Registrar post en src/lib/blogData.ts
4. Ejecutar lint/build

### Ajustes SEO

- Revisar metadata en src/app/layout.tsx y en la ruta específica.
- Mantener URL canónica consistente con www.

## 10) Fuentes de verdad del proyecto

- .github/copilot-instructions.md
- .github/instructions/frontend-design.instructions.md
- .github/instructions/version-control.instructions.md
- .github/instructions/engram-memory.instructions.md

Si hay conflicto entre documentos, priorizar las instrucciones más específicas para el archivo/tarea en curso.
