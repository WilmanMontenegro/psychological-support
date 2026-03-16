---
description: "Usar cuando el usuario pida recordar, guardar contexto o continuidad entre sesiones con memoria persistente usando Engram MCP."
---

# Protocolo de memoria Engram (workspace)

## Objetivo
Asegurar continuidad real entre sesiones usando Engram de forma proactiva y ordenada.

## Cuándo guardar (`mem_save`)
Guardar después de trabajo significativo:
- correcciones de bugs,
- decisiones de arquitectura,
- hallazgos de debugging,
- cambios de configuración,
- patrones reutilizables,
- preferencias del usuario relevantes para próximas tareas.

## Cuándo buscar (`mem_search` / `mem_context`)
- Al iniciar tareas que puedan solaparse con trabajo anterior.
- Cuando el usuario diga: "recuerda", "como hicimos", "continuemos", "qué habíamos dejado".
- Después de reset/compaction de contexto, llamar `mem_context` antes de continuar.

## Cierre de sesión
Antes de terminar una sesión importante, registrar resumen con `mem_session_summary`:
- objetivo,
- descubrimientos,
- cambios realizados,
- archivos tocados,
- próximos pasos.

## Higiene
- Evitar guardar ruido o logs crudos extensos.
- Resumir de forma concreta (qué, por qué, dónde, impacto).
- No almacenar secretos en texto plano.
