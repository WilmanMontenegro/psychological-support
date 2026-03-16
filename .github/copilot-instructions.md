# Instrucciones de Copilot para este proyecto

## Contexto
- Proyecto: plataforma web de apoyo psicológico en Next.js 15 + TypeScript + Tailwind v4 + Supabase.
- Idioma principal de código y documentación: español claro y técnico.
- Prioridad: simplicidad, minimalismo, legibilidad y cambios pequeños.

## Principios de implementación
- Resolver la causa raíz; evitar parches superficiales.
- No tocar áreas no relacionadas con la solicitud.
- Mantener componentes y páginas consistentes con el estilo actual.
- Evitar sobreingeniería: preferir soluciones directas y mantenibles.

## Frontend
- Respetar diseño mobile-first.
- Reutilizar componentes existentes en `src/components` antes de crear nuevos.
- Mantener accesibilidad básica (`aria-*`, labels, foco visible) cuando aplique.
- No introducir estilos inline innecesarios ni tokens visuales fuera de Tailwind/base actual.

## Seguridad y secretos
- Nunca hardcodear secretos.
- Mantener credenciales fuera del repositorio (`.env.local`).
- Si aparece un archivo sensible en raíz, sugerir eliminación o moverlo a almacenamiento seguro local.

## Calidad mínima antes de cerrar tareas
- Ejecutar `npm run lint` cuando haya cambios de código.
- Ejecutar `npm run build` en cambios relevantes de rutas/componentes.
- Reportar de forma breve: qué cambió, dónde, y cómo validar.
