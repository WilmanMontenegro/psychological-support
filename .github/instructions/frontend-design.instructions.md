---
applyTo: "src/app/**/*.tsx,src/components/**/*.tsx,src/app/globals.css"
description: "Usar cuando se diseñen o ajusten interfaces frontend en Next.js/Tailwind: mantener UI minimalista, responsive y consistente con el sistema actual."
---

# Guía de diseño frontend (minimalista)

## Objetivo
Diseñar interfaces limpias, rápidas y sin ruido visual, priorizando legibilidad y flujo del usuario.

## Reglas
- Preferir composición de componentes existentes antes de crear nuevos.
- Mantener jerarquía visual simple: un objetivo principal por vista.
- Reducir carga cognitiva: textos cortos, acciones claras, espaciado consistente.
- Mantener responsive por defecto (mobile-first).
- En formularios: labels explícitos, errores claros y estados de carga visibles.

## Evitar
- Patrones visuales nuevos sin necesidad (sombras, colores o animaciones extra).
- Duplicar lógica de UI entre páginas/componentes.
- Mezclar varios estilos de interacción para el mismo tipo de acción.

## Checklist rápido
- ¿Se entiende la pantalla en <5 segundos?
- ¿La acción primaria está clara?
- ¿Se ve bien en móvil y desktop?
- ¿Se reutilizó componente existente cuando era posible?
