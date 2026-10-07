# Notas — Tu Psico Ana

Proyecto hermano de `proyectos/vida` (mismo nivel). Todo el contexto vive **acá**, no dentro de vida.

Última actualización: 6 oct 2026.

## Hero home (en curso / local)

- Reemplazó el carrusel. Componente: `src/components/HeroVideo.tsx`.
- Video: `public/videos/hero-bienestar-1080.mp4` (~9 MB desktop) + `hero-bienestar-720.mp4` (~4.5 MB móvil) + poster.
- Original 4K en Downloads (no subir crudo): demasiado pesado para web.
- UI hero: **solo cita Rogers** + autor/fuente + **un** CTA.
- Cita: *«La curiosa paradoja es que cuando me acepto tal como soy, entonces puedo cambiar.»* — Carl R. Rogers, *El proceso de convertirse en persona* (1961).
- Overlay: scrim oscuro suave (no negro plano) + toque `#BF88AC`.
- Altura: `100dvh` menos header (`data-site-header`) y nav inferior móvil (`data-mobile-nav`).
- Loop: atributo `loop` + backup en `ended` (evitar listeners `pause`/`timeupdate` que frenaban).
- CTA: mismo patrón Link que AboutMe (`rounded-lg`, `var(--color-secondary)`), texto «Conóceme» → `/sobre-mi`. **No inventar botones nuevos.**
- Limpieza: borrados carrusel_*.jpg, manejo-emociones, video_marcela, Carousel.tsx, logos/favicon sin uso.

## Local

- Dev (PowerShell): `$env:NODE_OPTIONS="--disable-warning=DEP0205"; npx next dev --port 3000`
- `npm run dev` falla en Windows por `NODE_OPTIONS=...` estilo Unix.
- `.env.local` con placeholders Supabase solo para preview (auth no funciona así). Keys reales desde Vercel/Supabase.

## Pendiente

- [ ] Deploy a Vercel cuando Wilman diga.
- [ ] Sustituir `.env.local` placeholders por keys reales en máquina local.

## Engram

Project Engram: **`tupsicoana`** (scope `project`). Nunca guardar en `vida`.  
Si el chat está abierto en el vault vida, forzar `project: tupsicoana` al hacer `mem_save`.
