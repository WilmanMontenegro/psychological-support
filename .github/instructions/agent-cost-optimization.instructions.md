---
description: "Usar cuando se quiera optimizar costo/tokens en tareas con agentes: elegir modo directo vs SDD (agent-teams-lite), minimizar contexto y controlar validaciones."
---

# Optimización de costo con agentes (VS Code + Copilot + Engram)

## Objetivo
Reducir consumo de tokens/solicitudes manteniendo calidad en cambios de producto.

## Regla de decisión (rápida)
- **Modo directo (sin SDD)** cuando el cambio sea pequeño:
  - 1–2 archivos
  - <60 líneas aprox.
  - sin cambio de arquitectura
- **Modo SDD (agent-teams-lite)** cuando el cambio sea mediano/grande:
  - 3+ archivos o múltiples rutas/componentes
  - hay decisiones de UX/arquitectura
  - requiere plan + verificación por fases

## Perfil recomendado para ESTE proyecto
- Frontend menor (copy, spacing, bug visual): **modo directo**.
- Nueva feature (flujo, estado, múltiples pantallas): **SDD** con fases.
- Refactor de estructura compartida (`layout`, `auth`, `appointments`): **SDD**.

## Guardrails para ahorrar tokens
- Pedir entregas en bloques cortos y verificables.
- Evitar prompts amplios tipo "haz todo" sin alcance.
- Reusar componentes existentes antes de crear nuevos.
- Guardar decisiones clave en Engram (`mem_save`) para no re-explicar contexto.
- Cerrar sesiones con `mem_session_summary` para arrancar la siguiente sin rehacer análisis.

## Secuencia mínima sugerida (SDD)
1. `/sdd-init`
2. `/sdd-new <nombre-cambio>`
3. Revisar propuesta y diseño antes de implementar
4. `/sdd-apply`
5. `/sdd-verify`
6. `/sdd-archive`

## Política de validación costo/beneficio
- Cambios pequeños: solo validación específica + `npm run lint`.
- Cambios de rutas/componentes clave: `npm run lint` + `npm run build`.
- Evitar reruns completos innecesarios cuando no hubo cambios estructurales.
