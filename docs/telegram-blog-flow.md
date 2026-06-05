# Flujo de Blog por Telegram (Anita)

Guía operativa del flujo de publicación de blogs desde Telegram, con comandos, estados y troubleshooting.

## Objetivo

Permitir crear, editar, publicar y despublicar blogs directamente desde Telegram con un flujo simple:

1. Enviar texto del blog.
2. Enviar portada (foto o archivo de imagen) o responder `no`.
3. Confirmar con botones (`Publicar ahora` / `Dejar pendiente`).

Anita aplica formato editorial al texto (subtítulos, negritas, callouts) **sin cambiar la voz ni el contenido** de la autora.

## Endpoint y archivo principal

- Webhook: `src/app/api/telegram/webhook/route.ts`
- Endpoint: `/api/telegram/webhook`

## Modelo de datos involucrado

### Tabla `blog_drafts`

- Estados usados por el flujo:
  - `pending`
  - `published`
- Campos clave:
  - `title`, `slug`, `excerpt`, `content_raw`, `category`
  - `cover_url`
  - `seo_title`, `seo_description`, `inline_image_side`
  - `published_at`
  - `source_chat_id`, `source_message_id`

### Tabla `telegram_blog_flow`

Mantiene contexto por chat:

- `chat_id` (PK lógico)
- `step`: `awaiting_content | accumulating_content | awaiting_image`
- `draft_id` (UUID del borrador en curso)
- `content_buffer` (texto acumulado cuando Telegram parte un mensaje largo)
- `buffer_message_ids` (IDs de mensajes ya unidos, evita duplicados)
- `updated_at`

## Migraciones relevantes

- `20260505100000_create_blog_drafts_table.sql`
- `20260505102000_create_blog_covers_bucket.sql`
- `20260505113000_extend_blog_drafts_for_publication.sql`
- `20260505120000_create_telegram_blog_flow.sql`
- `20260505115500_allow_published_status_on_blog_drafts.sql`
- `20260604120000_telegram_content_buffer.sql`

## Comandos de Telegram soportados

- `/start`, `/nuevo`, `/blog`, `/crear`, `/reset`
  - Reinician flujo y piden texto del blog.
- `/despublicar`
  - Despublica el último post publicado de ese chat.
- `/despublicar <slug>`
  - Despublica un post publicado específico por slug.
- Frases naturales:
  - `despublicalo`, `despublícalo`, `despublicar`, `despublica`

## Reglas importantes de comportamiento

### Texto largo partido en 2 mensajes

Telegram limita cada mensaje a ~4096 caracteres. Anita une partes automáticamente:

| Situación | Comportamiento |
|-----------|----------------|
| Texto corto (&lt; ~3200 chars) | Crea borrador al instante |
| Texto muy largo (≥ ~3200 chars) | Espera la 2ª parte en `accumulating_content` |
| 2ª parte de texto | Une todo, aplica editor IA, crea borrador |
| Solo 1 bloque largo + foto o `no` | Finaliza el buffer y continúa el flujo |
| 2ª parte mientras ya hay borrador | Concatena y re-aplica editor IA |

No hace falta escribir `listo`.

### Formato editorial (magia visual)

Tras recibir el texto, la IA genera `contentClean` y se guarda en `content_raw`:

- `## Subtítulo` → sección en el post
- `**frase clave**` → negrita
- `✅ Título: cuerpo`, `⚠️ Título: cuerpo`, `💭 Recuerda: cuerpo` → cajas de callout

El render dinámico en `src/app/blog/[slug]/page.tsx` interpreta esas marcas.

### Otros

- Si llega una imagen sin texto:
  - Busca y actualiza el último borrador `pending` del chat (aunque el estado de flujo esté desfasado).
- Se aceptan portadas en:
  - `photo` de Telegram
  - `document` con `mime_type` de imagen
  - archivos `.jpg/.jpeg/.png/.webp`
- Límite de portada: `400 KB`.
- Si no hay imagen (`no`), sugiere búsqueda breve y permite publicar igual.
- Al publicar:
  - marca `status = published`
  - asigna `published_at`
  - responde con URL del post.
- Si hay choque de slug al publicar:
  - se genera slug alterno automáticamente y reintenta.

## Variables de entorno críticas

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_ALLOWED_CHAT_IDS`
- `TELEGRAM_WEBHOOK_SECRET` (opcional, recomendado)
- `NEXT_PUBLIC_SITE_URL`
- `AI_PROVIDER` (`gemini` por defecto)
- `GEMINI_API_KEY`, `GEMINI_MODEL` (si aplica)
- `OPENAI_API_KEY`, `OPENAI_MODEL` (si aplica)

Si posts muy largos se truncan en producción, probar `GEMINI_MODEL=gemini-2.0-flash` o OpenAI para el paso editor.

## Operación y despliegue

1. Validar local:

```bash
pnpm run lint
pnpm run build
```

2. Aplicar migraciones remotas:

```bash
supabase db push
```

3. Deploy:

```bash
vercel --prod --yes
```

## Checklist manual post-cambio

1. Post corto (1 mensaje) → callouts + negritas + `##` visibles en `/blog/[slug]`.
2. Post en 2 mensajes (~2000 + ~2000) → contenido completo publicado.
3. Post en 1 mensaje ~3800 chars + foto o `no` → publica bien sin 2ª parte.
4. Verificar que el texto no se acorta vs original de la autora.

## Troubleshooting rápido

### 1) "No se pudo publicar"

Checklist:

- Revisar que migraciones estén aplicadas (`supabase db push`).
- Confirmar que `blog_drafts.status` permita `published`.
- Revisar logs del deployment en Vercel.

### 2) Envié imagen y no la tomó

- Confirmar que sea `photo` o `document` de imagen.
- Verificar tamaño `< 400 KB`.
- Confirmar que exista borrador `pending` del chat.

### 3) Se ve plano visualmente

- Confirmar que la migración `20260604120000` esté aplicada.
- Revisar que `content_raw` tenga marcas `##`, `**` o callouts (editor IA).
- Si el post es anterior al cambio, republicar desde Telegram o editar borrador.

### 4) Solo quedó la última parte del texto

- Debería estar resuelto con acumulación + append; si persiste, revisar logs del webhook y estado `telegram_blog_flow`.

## Nota de mantenimiento

Si el webhook crece más, dividir `route.ts` en módulos (`flow`, `publishing`, `telegram-media`, `ai`) para mantener legibilidad.
