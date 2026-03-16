---
name: frontend-versioning
description: "Usar cuando se pidan mejoras de frontend en Next.js/Tailwind junto con buenas prácticas de versionado, checklist de calidad y preparación de release."
---

# Skill: Frontend + Versionado

## Cuándo usar
- Ajustes o refactors visuales en `src/app` o `src/components`.
- Mejoras de UX minimalista/mobile-first.
- Preparación de cambios para commit o release.

## Flujo recomendado
1. Identificar alcance exacto del cambio (vista/componente/estado).
2. Reutilizar componentes existentes antes de crear nuevos.
3. Implementar con cambios pequeños y consistentes con el diseño actual.
4. Ejecutar validación mínima:
   - `npm run lint`
   - `npm run build` (si el cambio toca rutas, componentes principales o layout)
5. Sugerir mensaje de commit en formato convencional.

## Criterios de calidad
- Interfaz clara y sin sobrecarga visual.
- Accesibilidad básica en controles interactivos.
- Sin secretos en código o archivos versionados.
- Reporte final corto: cambios, archivos, validación.

## Plantillas rápidas

### Commit sugerido
`<tipo>: <acción en imperativo>`

Ejemplos:
- `feat: simplificar cabecera en móvil`
- `fix: corregir foco en formulario de contacto`
- `refactor: unificar estilos de tarjetas del blog`

### Checklist de entrega
- [ ] Alcance respetado
- [ ] Reutilización de componentes existente
- [ ] `npm run lint` OK
- [ ] `npm run build` OK (cuando aplique)
- [ ] Sin secretos ni archivos sensibles en staging
