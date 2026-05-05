import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createAdminClient } from '@/lib/supabase-admin';

const TELEGRAM_API_BASE = 'https://api.telegram.org';
const COVER_BUCKET = 'blog-covers';
const FALLBACK_CATEGORY = 'Bienestar';
const MAX_COVER_FILE_SIZE_BYTES = 400 * 1024;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_AI_MODEL = 'gpt-4o-mini';
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_GEMINI_MODEL = 'gemini-3.1-flash-lite-preview';
const AI_TIMEOUT_MS = 12000;

type TelegramPhoto = {
  file_id: string;
  file_unique_id: string;
  width: number;
  height: number;
  file_size?: number;
};

type TelegramDocument = {
  file_id: string;
  file_unique_id: string;
  file_name?: string;
  mime_type?: string;
  file_size?: number;
};

type TelegramMessage = {
  message_id: number;
  chat?: { id?: number };
  text?: string;
  caption?: string;
  photo?: TelegramPhoto[];
  document?: TelegramDocument;
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
  callback_query?: {
    id: string;
    data?: string;
    message?: TelegramMessage;
    from?: { id?: number };
  };
};

const categoryRules: Record<string, string[]> = {
  'Salud Mental': ['ansiedad', 'depresion', 'estrés', 'estres', 'salud mental', 'terapia'],
  Autoestima: ['autoestima', 'amor propio', 'autocuidado', 'limites', 'límites'],
  Maternidad: ['postparto', 'maternidad', 'embarazo', 'mamá', 'mama', 'lactancia'],
  Bienestar: ['bienestar', 'emociones', 'emocional', 'mindfulness', 'calma'],
};

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}.`);
  }
  return value;
}

function parseAllowedChatIds(raw: string): Set<number> {
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => Number(item))
      .filter((item) => Number.isFinite(item))
  );
}

function normalizeText(value: string): string {
  return value
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}

function isLikelyPreambleLine(line: string): boolean {
  const lower = line.toLowerCase().trim();
  if (!lower) return true;
  const patterns = [
    /^hola\b/,
    /^buen[ao]s?\b/,
    /^mira\b/,
    /^te comparto\b/,
    /^te envio\b/,
    /^tengo este blog\b/,
    /^puedes subirlo\b/,
    /^quiero subir\b/,
    /^por favor\b/,
  ];

  return patterns.some((pattern) => pattern.test(lower));
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

function buildPublishedSlug(baseSlug: string): string {
  const safeBase = slugify(baseSlug) || 'blog';
  const suffix = Date.now().toString(36).slice(-6);
  return `${safeBase}-${suffix}`.slice(0, 80);
}

function inferCategory(text: string): string {
  const lower = text.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryRules)) {
    if (keywords.some((keyword) => lower.includes(keyword))) {
      return category;
    }
  }

  return FALLBACK_CATEGORY;
}

type AiDraftResult = {
  title?: string;
  excerpt?: string;
  category?: string;
  contentClean?: string;
  seoTitle?: string;
  seoDescription?: string;
  inlineImageSide?: 'left' | 'right';
};

function isAllowedCategory(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(categoryRules, value);
}

function sanitizeAiDraft(parsed: AiDraftResult): AiDraftResult {
  const result: AiDraftResult = {};

  if (parsed.title && typeof parsed.title === 'string') {
    result.title = parsed.title.trim().slice(0, 140);
  }
  if (parsed.excerpt && typeof parsed.excerpt === 'string') {
    result.excerpt = parsed.excerpt.trim().slice(0, 220);
  }
  if (
    parsed.category &&
    typeof parsed.category === 'string' &&
    isAllowedCategory(parsed.category.trim())
  ) {
    result.category = parsed.category.trim();
  }
  if (parsed.contentClean && typeof parsed.contentClean === 'string') {
    result.contentClean = normalizeText(parsed.contentClean);
  }
  if (parsed.seoTitle && typeof parsed.seoTitle === 'string') {
    result.seoTitle = parsed.seoTitle.trim().slice(0, 160);
  }
  if (parsed.seoDescription && typeof parsed.seoDescription === 'string') {
    result.seoDescription = parsed.seoDescription.trim().slice(0, 200);
  }
  if (parsed.inlineImageSide === 'left' || parsed.inlineImageSide === 'right') {
    result.inlineImageSide = parsed.inlineImageSide;
  }

  return result;
}

function sanitizeAiChatReply(value: string): string {
  const normalized = normalizeText(value)
    .replace(/\*\*/g, '')
    .replace(/^\*{2,}|\*{2,}$/gm, '')
    .slice(0, 380);
  return normalized || 'Pásame el texto del blog y seguimos.';
}

async function getAssistantReply(inputText: string): Promise<string | null> {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  if (provider === 'gemini') {
    return getAssistantReplyWithGemini(inputText);
  }

  return getAssistantReplyWithOpenAI(inputText);
}

async function getAssistantReplyWithOpenAI(inputText: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || DEFAULT_AI_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.5,
        max_tokens: 220,
        messages: [
          {
            role: 'system',
            content:
              'Eres Anita en Telegram. Responde en español en MÁXIMO 3 frases cortas. Nunca reescribas un blog completo ni pongas titulos largos. Si piden ideas de imagen: exactamente 3 lineas breves (una idea por linea), sin markdown ni numeracion larga.',
          },
          { role: 'user', content: inputText },
        ],
      }),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content;
    if (!text) return null;
    return sanitizeAiChatReply(text);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function getAssistantReplyWithGemini(inputText: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Eres Anita en Telegram. Responde en español en MÁXIMO 3 frases cortas. Nunca reescribas un blog completo. Si piden ideas de imagen: exactamente 3 lineas breves, sin markdown pesado.',
              },
            ],
          },
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 220,
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: inputText }],
            },
          ],
        }),
      }
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return null;
    return sanitizeAiChatReply(text);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function improveDraftWithAi(
  sourceText: string,
  current: { title: string; excerpt: string; category: string }
): Promise<AiDraftResult | null> {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  if (provider === 'gemini') {
    return improveDraftWithGemini(sourceText, current);
  }

  return improveDraftWithOpenAI(sourceText, current);
}

async function improveDraftWithOpenAI(
  sourceText: string,
  current: { title: string; excerpt: string; category: string }
): Promise<AiDraftResult | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || DEFAULT_AI_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Eres editor de un blog de bienestar emocional. Recibes texto del autor. Conserva su voz, tono y mensaje: NO lo conviertas en marketing ni lo acortes demasiado. Solo quita saludos y meta-texto tipo "sube esto". Devuelve solo JSON con: title, excerpt, category, contentClean, seoTitle, seoDescription, inlineImageSide. contentClean debe respetar el texto original del autor (misma idea, orden y estructura), sin inventar secciones ni agregar listas que no existan. category: Salud Mental | Autoestima | Maternidad | Bienestar. inlineImageSide: left o right.',
          },
          {
            role: 'user',
            content: `Texto recibido:\n${sourceText}\n\nBorrador actual:\n${JSON.stringify(
              current
            )}`,
          },
        ],
      }),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AiDraftResult;
    return sanitizeAiDraft(parsed);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function improveDraftWithGemini(
  sourceText: string,
  current: { title: string; excerpt: string; category: string }
): Promise<AiDraftResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Eres editor de un blog de bienestar emocional. Conserva voz y mensaje del autor; no reescribas como anuncio. Quita solo saludos y meta-texto. Devuelve solo JSON: title, excerpt, category, contentClean, seoTitle, seoDescription, inlineImageSide. contentClean debe respetar el texto original (misma idea, orden y estructura), sin inventar secciones ni agregar listas. category: Salud Mental | Autoestima | Maternidad | Bienestar. inlineImageSide: left o right.',
              },
            ],
          },
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          },
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Texto recibido:\n${sourceText}\n\nBorrador actual:\n${JSON.stringify(
                    current
                  )}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) return null;

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;

    const parsed = JSON.parse(raw) as AiDraftResult;
    return sanitizeAiDraft(parsed);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function parseDraftContent(message: TelegramMessage) {
  const rawContent = normalizeText(message.caption || message.text || '');
  const lines = rawContent
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const linesWithoutPreamble = lines.filter((line) => !isLikelyPreambleLine(line));
  const effectiveLines = linesWithoutPreamble.length > 0 ? linesWithoutPreamble : lines;

  const firstLine = effectiveLines[0] || `Borrador ${new Date().toISOString().slice(0, 10)}`;
  const title = firstLine.replace(/^titulo:\s*/i, '').slice(0, 140);
  const slugBase = slugify(title || firstLine);
  const slug = slugBase || `borrador-${Date.now()}`;
  const contentBody = effectiveLines.slice(1).join('\n\n').trim();
  const excerptSource = effectiveLines[1] || contentBody || title;
  const excerpt = excerptSource.slice(0, 220);
  const contentRaw = contentBody || rawContent || title;

  return {
    title,
    slug,
    excerpt,
    contentRaw,
    category: inferCategory(`${title}\n${contentRaw}`),
  };
}

type FlowStep = 'awaiting_content' | 'awaiting_image';
type UserIntent =
  | 'reset'
  | 'unpublish'
  | 'unpublish_delete'
  | 'no_image'
  | 'blog_content'
  | 'greeting'
  | 'other';

const ANITA_INTRO =
  'Hola, soy Anita. Pásame el texto completo del blog (puede ser largo). Después te pregunto por la imagen de portada y publicamos cuando quieras.';

function buildGuidedQuestionsMessage() {
  return ANITA_INTRO;
}

function isTrivialGreeting(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (t.length > 80) return false;
  return /^(hola|buenas|buenos|hey|buen día|buen dia|qué tal|que tal)\b|^\/start\b/.test(t);
}

function wantsNoImage(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t || t.length > 40) return false;
  const phrases = ['no', 'nop', 'nope', 'sin imagen', 'sin foto', 'no tengo', 'no hay', 'sin portada', 'omitir'];
  return phrases.some((p) => t === p || t.startsWith(`${p} `) || t === `${p}.`);
}

function wantsUnpublish(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t || t.length > 60) return false;
  return (
    t === '/despublicar' ||
    t.startsWith('/despublicar ') ||
    t.startsWith('/despublicar@') ||
    t === 'despublicalo' ||
    t === 'despublícalo' ||
    t === 'despublicar' ||
    t === 'despublica' ||
    t === 'despublciar' ||
    t === 'despublcar'
  );
}

function wantsUnpublishAndDelete(text: string): boolean {
  const t = text.trim().toLowerCase();
  if (!t || t.length > 80) return false;
  if (
    t === '/despublicar-y-borrar' ||
    t.startsWith('/despublicar-y-borrar ') ||
    t === 'despublicar y borrar' ||
    t === 'despublica y borra'
  ) {
    return true;
  }

  // Variantes naturales: "despublicalo y borralo", "despublícalo y bórralo", etc.
  const normalized = t.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const hasUnpublishIntent =
    normalized.includes('despublic') || normalized.includes('despubl');
  const hasDeleteIntent =
    normalized.includes('borrar') || normalized.includes('borralo') || normalized.includes('elimina');
  return hasUnpublishIntent && hasDeleteIntent;
}

function isLikelyBlogBody(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length >= 160) return true;
  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean);
  return lines.length >= 4 && trimmed.length >= 90;
}

function isResetCommand(text: string): boolean {
  const t = text.trim().toLowerCase();
  return t === '/start' || t === '/nuevo' || t === '/blog' || t === '/crear' || t === '/reset';
}

function maybePublishingAction(inputText: string): boolean {
  const normalized = inputText
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  if (!normalized || normalized.length > 120) return false;

  const actionHints = [
    'despublic',
    'despubl',
    'depublic',
    'borrar',
    'borralo',
    'eliminar',
    'eliminalo',
    'quitar',
    'quitalo',
  ];

  return actionHints.some((hint) => normalized.includes(hint));
}

function toValidIntent(value: string | undefined): UserIntent | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  const allowed: UserIntent[] = [
    'reset',
    'unpublish',
    'unpublish_delete',
    'no_image',
    'blog_content',
    'greeting',
    'other',
  ];
  return allowed.includes(normalized as UserIntent) ? (normalized as UserIntent) : null;
}

function inferIntentRuleBased(inputText: string): UserIntent {
  if (isResetCommand(inputText)) return 'reset';
  if (wantsUnpublishAndDelete(inputText)) return 'unpublish_delete';
  if (wantsUnpublish(inputText)) return 'unpublish';
  if (wantsNoImage(inputText)) return 'no_image';
  if (isLikelyBlogBody(inputText)) return 'blog_content';
  if (isTrivialGreeting(inputText)) return 'greeting';
  return 'other';
}

async function inferIntentWithOpenAI(inputText: string): Promise<UserIntent | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENAI_MODEL || DEFAULT_AI_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 40,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'Clasifica intención para un bot de Telegram. Responde solo JSON: {"intent":"..."} usando una etiqueta exacta: reset, unpublish, unpublish_delete, no_image, blog_content, greeting, other.',
          },
          { role: 'user', content: inputText },
        ],
      }),
    });
    if (!response.ok) return null;

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { intent?: string };
    return toValidIntent(parsed.intent);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function inferIntentWithGemini(inputText: string): Promise<UserIntent | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);

  try {
    const response = await fetch(
      `${GEMINI_API_BASE}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: 'Clasifica intención para un bot de Telegram. Devuelve solo JSON con {"intent":"..."} y etiqueta exacta entre: reset, unpublish, unpublish_delete, no_image, blog_content, greeting, other.',
              },
            ],
          },
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 40,
            responseMimeType: 'application/json',
          },
          contents: [
            {
              role: 'user',
              parts: [{ text: inputText }],
            },
          ],
        }),
      }
    );
    if (!response.ok) return null;

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { intent?: string };
    return toValidIntent(parsed.intent);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function inferUserIntent(inputText: string): Promise<UserIntent> {
  const ruleBased = inferIntentRuleBased(inputText);
  if (ruleBased === 'blog_content' || ruleBased === 'reset') return ruleBased;

  if (!inputText || inputText.length > 420) return ruleBased;

  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
  const aiIntent =
    provider === 'gemini'
      ? await inferIntentWithGemini(inputText)
      : await inferIntentWithOpenAI(inputText);

  if (ruleBased === 'other' && maybePublishingAction(inputText)) {
    if (aiIntent === 'unpublish_delete' || aiIntent === 'unpublish') return aiIntent;
  }

  if (!aiIntent || aiIntent === 'other') return ruleBased;

  // Guardrail para acciones destructivas: exige señales mínimas también por reglas.
  if (aiIntent === 'unpublish_delete' && !wantsUnpublishAndDelete(inputText)) return ruleBased;
  if (aiIntent === 'unpublish' && !wantsUnpublish(inputText)) return ruleBased;

  return aiIntent;
}

function publishKeyboard(draftId: string) {
  return {
    inline_keyboard: [
      [
        { text: 'Publicar ahora', callback_data: `publish:${draftId}` },
        { text: 'Dejar pendiente', callback_data: `keep:${draftId}` },
      ],
    ],
  };
}

async function getFlow(chatId: number): Promise<{ step: FlowStep; draft_id: string | null }> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('telegram_blog_flow')
    .select('step, draft_id')
    .eq('chat_id', chatId)
    .maybeSingle();
  return {
    step: (data?.step as FlowStep) || 'awaiting_content',
    draft_id: data?.draft_id ?? null,
  };
}

async function upsertFlow(chatId: number, step: FlowStep, draftId: string | null) {
  const supabase = createAdminClient();
  await supabase.from('telegram_blog_flow').upsert(
    {
      chat_id: chatId,
      step,
      draft_id: draftId,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'chat_id' }
  );
}

async function clearFlowAfterPublish(chatId: number) {
  await upsertFlow(chatId, 'awaiting_content', null);
}

function extractCommandSlug(inputText: string): string {
  const normalized = inputText.trim().toLowerCase();
  if (!normalized.startsWith('/')) return '';

  const [command, ...args] = normalized.split(/\s+/);
  const supportsSlug =
    command === '/despublicar' ||
    command.startsWith('/despublicar@') ||
    command === '/despublicar-y-borrar';

  if (!supportsSlug || args.length === 0) return '';
  return slugify(args.join(' '));
}

function extractStorageObjectPath(publicUrl: string, bucket: string): string | null {
  try {
    const parsed = new URL(publicUrl);
    const marker = `/storage/v1/object/public/${bucket}/`;
    const index = parsed.pathname.indexOf(marker);
    if (index === -1) return null;
    const rawObjectPath = parsed.pathname.slice(index + marker.length);
    return rawObjectPath ? decodeURIComponent(rawObjectPath) : null;
  } catch {
    return null;
  }
}

async function deleteCoverFromBucket(coverUrl: string | null): Promise<boolean> {
  if (!coverUrl) return true;
  const objectPath = extractStorageObjectPath(coverUrl, COVER_BUCKET);
  if (!objectPath) return false;

  const supabase = createAdminClient();
  const { error } = await supabase.storage.from(COVER_BUCKET).remove([objectPath]);
  return !error;
}

async function findPublishedDraftTarget(chatId: number, incomingRaw: string) {
  const supabase = createAdminClient();
  const slugArg = extractCommandSlug(incomingRaw);

  let targetQuery = supabase
    .from('blog_drafts')
    .select('id, title, slug, cover_url')
    .eq('source_chat_id', chatId)
    .eq('status', 'published');

  if (slugArg) {
    targetQuery = targetQuery.eq('slug', slugArg);
  } else {
    targetQuery = targetQuery.order('published_at', { ascending: false, nullsFirst: false }).limit(1);
  }

  let { data: target, error: targetError } = await targetQuery.maybeSingle();

  // Fallback: si no hay match por chat, intenta en todos los posts publicados.
  if (!target) {
    let fallbackQuery = supabase
      .from('blog_drafts')
      .select('id, title, slug, cover_url')
      .eq('status', 'published');
    if (slugArg) {
      fallbackQuery = fallbackQuery.eq('slug', slugArg);
    } else {
      fallbackQuery = fallbackQuery
        .order('published_at', { ascending: false, nullsFirst: false })
        .order('created_at', { ascending: false })
        .limit(1);
    }
    const fallback = await fallbackQuery.maybeSingle();
    target = fallback.data ?? null;
    targetError = targetError || fallback.error;
  }

  if (targetError || !target) {
    return { target: null, slugArg };
  }

  return { target, slugArg };
}

async function unpublishDraftForChat(token: string, chatId: number, incomingRaw: string) {
  const supabase = createAdminClient();
  const { target, slugArg } = await findPublishedDraftTarget(chatId, incomingRaw);
  if (!target) {
    await sendTelegramMessage(
      token,
      chatId,
      slugArg
        ? `No encontré un post publicado con slug "${slugArg}".`
        : 'No encontré posts publicados para despublicar.'
    );
    return;
  }

  const { error: updateError } = await supabase
    .from('blog_drafts')
    .update({ status: 'pending', published_at: null })
    .eq('id', target.id);

  if (updateError) {
    await sendTelegramMessage(token, chatId, 'No pude despublicar ese post. Intenta de nuevo.');
    return;
  }

  revalidatePath('/blog');
  revalidatePath(`/blog/${target.slug}`);

  await sendTelegramMessage(token, chatId, `Listo. "${target.title}" quedó despublicado y volvió a borrador.`, {
    replyMarkup: publishKeyboard(target.id),
  });
}

async function unpublishAndDeleteDraftForChat(token: string, chatId: number, incomingRaw: string) {
  const supabase = createAdminClient();
  const { target, slugArg } = await findPublishedDraftTarget(chatId, incomingRaw);
  if (!target) {
    await sendTelegramMessage(
      token,
      chatId,
      slugArg
        ? `No encontré un post publicado con slug "${slugArg}".`
        : 'No encontré posts publicados para despublicar y borrar.'
    );
    return;
  }

  const { error: deleteError } = await supabase.from('blog_drafts').delete().eq('id', target.id);
  if (deleteError) {
    await sendTelegramMessage(token, chatId, 'No pude despublicar y borrar ese post. Intenta de nuevo.');
    return;
  }

  const coverDeleted = await deleteCoverFromBucket(target.cover_url ?? null);

  revalidatePath('/blog');
  revalidatePath(`/blog/${target.slug}`);
  await sendTelegramMessage(
    token,
    chatId,
    coverDeleted
      ? `Listo. "${target.title}" fue despublicado y eliminado junto con su portada.`
      : `Listo. "${target.title}" fue despublicado y eliminado. Nota: no pude borrar la portada del bucket automáticamente.`
  );
}

async function resolvePendingDraftForChat(
  chatId: number,
  preferredDraftId: string | null
): Promise<{ id: string; slug: string; title: string } | null> {
  const supabase = createAdminClient();
  if (preferredDraftId) {
    const { data } = await supabase
      .from('blog_drafts')
      .select('id, slug, title')
      .eq('id', preferredDraftId)
      .eq('status', 'pending')
      .maybeSingle();
    if (data) return data;
  }
  const { data: latest } = await supabase
    .from('blog_drafts')
    .select('id, slug, title')
    .eq('source_chat_id', chatId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  return latest;
}

async function insertDraftFromMessage(
  token: string,
  chatId: number,
  message: TelegramMessage,
  incomingRaw: string
): Promise<{ id: string; title: string; hadCover: boolean } | null> {
  const parsedDraft = parseDraftContent(message);
  const aiDraft = await improveDraftWithAi(incomingRaw, {
    title: parsedDraft.title,
    excerpt: parsedDraft.excerpt,
    category: parsedDraft.category,
  });

  const title = aiDraft?.title || parsedDraft.title;
  const excerpt = aiDraft?.excerpt || parsedDraft.excerpt;
  const category = aiDraft?.category || parsedDraft.category;
  const slug = slugify(title) || parsedDraft.slug;
  const contentRaw = parsedDraft.contentRaw;
  const seoTitle = aiDraft?.seoTitle || `${title} | Tu Psico Ana`;
  const seoDescription = aiDraft?.seoDescription || excerpt;
  const inlineImageSide = aiDraft?.inlineImageSide || 'right';

  let coverUrl: string | null = null;
  try {
    coverUrl = await uploadCoverFromTelegram(token, getLatestCoverAsset(message), slug);
  } catch (error) {
    if (error instanceof Error && error.message === 'IMAGE_TOO_LARGE') {
      await sendTelegramMessage(
        token,
        chatId,
        'La imagen es demasiado pesada. Usa una portada menor a 400 KB para mantener el plan gratis.'
      );
      return null;
    }
    throw error;
  }

  const supabase = createAdminClient();
  const { data: insertedDraft, error } = await supabase
    .from('blog_drafts')
    .insert({
      title,
      slug,
      excerpt,
      content_raw: contentRaw,
      category,
      cover_url: coverUrl,
      seo_title: seoTitle,
      seo_description: seoDescription,
      inline_image_side: inlineImageSide,
      status: 'pending',
      source_chat_id: chatId,
      source_message_id: message.message_id,
    })
    .select('id')
    .single();

  if (error) {
    const duplicate = error.message.toLowerCase().includes('duplicate');
    if (duplicate) {
      await sendTelegramMessage(
        token,
        chatId,
        `Este mensaje ya fue procesado. Si quieres otro post, escribe /nuevo.`
      );
      return null;
    }
    throw error;
  }

  return { id: insertedDraft.id, title, hadCover: Boolean(coverUrl) };
}

async function updateDraftBodyFromText(draftId: string, incomingRaw: string) {
  const parsedDraft = parseDraftContent({ ...({} as TelegramMessage), text: incomingRaw });
  const aiDraft = await improveDraftWithAi(incomingRaw, {
    title: parsedDraft.title,
    excerpt: parsedDraft.excerpt,
    category: parsedDraft.category,
  });

  const excerpt = aiDraft?.excerpt || parsedDraft.excerpt;
  const category = aiDraft?.category || parsedDraft.category;
  const contentRaw = parsedDraft.contentRaw;
  const seoTitle = aiDraft?.seoTitle;
  const seoDescription = aiDraft?.seoDescription || excerpt;
  const inlineImageSide = aiDraft?.inlineImageSide || 'right';

  const supabase = createAdminClient();
  await supabase
    .from('blog_drafts')
    .update({
      content_raw: contentRaw,
      excerpt,
      category,
      seo_description: seoDescription,
      inline_image_side: inlineImageSide,
      ...(seoTitle ? { seo_title: seoTitle } : {}),
    })
    .eq('id', draftId)
    .eq('status', 'pending');
}

async function telegramRequest<T>(
  token: string,
  method: string,
  body: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Telegram API falló en ${method}: ${response.status}`);
  }

  const data = (await response.json()) as { ok: boolean; result?: T };
  if (!data.ok || !data.result) {
    throw new Error(`Telegram API respondió error en ${method}.`);
  }

  return data.result;
}

async function uploadCoverFromTelegram(
  token: string,
  asset: TelegramPhoto | TelegramDocument | undefined,
  slug: string
): Promise<string | null> {
  if (!asset) return null;
  if (asset.file_size && asset.file_size > MAX_COVER_FILE_SIZE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE');
  }

  const fileResult = await telegramRequest<{ file_path: string }>(token, 'getFile', {
    file_id: asset.file_id,
  });

  const filePath = fileResult.file_path;
  if (!filePath) return null;

  const downloadUrl = `${TELEGRAM_API_BASE}/file/bot${token}/${filePath}`;
  const fileResponse = await fetch(downloadUrl);
  if (!fileResponse.ok) {
    throw new Error(`No se pudo descargar la imagen de Telegram: ${fileResponse.status}`);
  }
  const contentLength = fileResponse.headers.get('content-length');
  if (contentLength && Number(contentLength) > MAX_COVER_FILE_SIZE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE');
  }

  const arrayBuffer = await fileResponse.arrayBuffer();
  if (arrayBuffer.byteLength > MAX_COVER_FILE_SIZE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE');
  }
  const contentType = fileResponse.headers.get('content-type') || 'image/jpeg';
  const lowerFilePath = filePath.toLowerCase();
  const extension =
    contentType.includes('png') || lowerFilePath.endsWith('.png')
      ? 'png'
      : contentType.includes('webp') || lowerFilePath.endsWith('.webp')
        ? 'webp'
        : 'jpg';
  const objectPath = `${slug}-${Date.now()}.${extension}`;

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(objectPath, Buffer.from(arrayBuffer), {
      contentType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl || null;
}

async function sendTelegramMessage(
  token: string,
  chatId: number,
  text: string,
  options?: {
    replyMarkup?: Record<string, unknown>;
  }
) {
  try {
    await telegramRequest(token, 'sendMessage', {
      chat_id: chatId,
      text,
      ...(options?.replyMarkup ? { reply_markup: options.replyMarkup } : {}),
    });
  } catch (error) {
    console.error('No se pudo enviar respuesta a Telegram:', error);
  }
}

function getLatestPhoto(message: TelegramMessage): TelegramPhoto | undefined {
  if (!message.photo || message.photo.length === 0) return undefined;
  return message.photo[message.photo.length - 1];
}

function getImageDocument(message: TelegramMessage): TelegramDocument | undefined {
  const document = message.document;
  if (!document) return undefined;

  const mimeType = document.mime_type?.toLowerCase() || '';
  const fileName = document.file_name?.toLowerCase() || '';
  if (mimeType.startsWith('image/')) return document;
  if (/\.(jpg|jpeg|png|webp)$/i.test(fileName)) return document;
  return undefined;
}

function getLatestCoverAsset(message: TelegramMessage): TelegramPhoto | TelegramDocument | undefined {
  return getLatestPhoto(message) || getImageDocument(message);
}

async function answerCallbackQuery(token: string, callbackQueryId: string, text: string) {
  try {
    await telegramRequest(token, 'answerCallbackQuery', {
      callback_query_id: callbackQueryId,
      text,
    });
  } catch (error) {
    console.error('No se pudo responder callback de Telegram:', error);
  }
}

async function handleCallbackAction(
  token: string,
  callbackQuery: NonNullable<TelegramUpdate['callback_query']>
) {
  const callbackData = callbackQuery.data || '';
  const callbackMessage = callbackQuery.message;
  const chatId = callbackMessage?.chat?.id;
  const callbackId = callbackQuery.id;

  if (!chatId || !callbackId) return;

  const [action, draftId] = callbackData.split(':');
  if (!action || !draftId) {
    await answerCallbackQuery(token, callbackId, 'Accion no valida');
    return;
  }

  if (action === 'keep') {
    await answerCallbackQuery(token, callbackId, 'Borrador queda pendiente');
    await sendTelegramMessage(token, chatId, 'Listo. El borrador quedó pendiente para publicarlo cuando quieras.');
    await clearFlowAfterPublish(chatId);
    return;
  }

  if (action !== 'publish') {
    await answerCallbackQuery(token, callbackId, 'Accion no soportada');
    return;
  }

  const supabase = createAdminClient();
  const { data: draft, error: draftError } = await supabase
    .from('blog_drafts')
    .select('id, slug, title, status')
    .eq('id', draftId)
    .maybeSingle();

  if (draftError || !draft) {
    await answerCallbackQuery(token, callbackId, 'No encontré ese borrador');
    return;
  }

  if (draft.status === 'published') {
    await answerCallbackQuery(token, callbackId, 'Ese borrador ya está publicado');
    return;
  }

  let publishedSlug = draft.slug;
  let publishError: { message?: string } | null = null;

  const { error: primaryPublishError } = await supabase
    .from('blog_drafts')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('id', draftId);

  if (!primaryPublishError) {
    publishError = null;
  } else {
    const errorMessage = primaryPublishError.message?.toLowerCase() || '';
    const slugConflict =
      errorMessage.includes('duplicate key') ||
      errorMessage.includes('blog_drafts_published_slug_unique_idx');
    const missingPublishedAt = errorMessage.includes('published_at');

    if (slugConflict) {
      publishedSlug = buildPublishedSlug(draft.slug);
      const { error: slugRetryError } = await supabase
        .from('blog_drafts')
        .update({
          slug: publishedSlug,
          status: 'published',
          published_at: new Date().toISOString(),
        })
        .eq('id', draftId);
      publishError = slugRetryError;
    } else if (missingPublishedAt) {
      const { error: publishedAtRetryError } = await supabase
        .from('blog_drafts')
        .update({ status: 'published' })
        .eq('id', draftId);
      publishError = publishedAtRetryError;
    } else {
      publishError = primaryPublishError;
    }
  }

  if (publishError) {
    await answerCallbackQuery(token, callbackId, 'No se pudo publicar');
    const publishErrorMessage = publishError.message?.toLowerCase() || '';
    if (
      publishErrorMessage.includes('blog_drafts_status_check') ||
      (publishErrorMessage.includes('status') && publishErrorMessage.includes('check'))
    ) {
      await sendTelegramMessage(
        token,
        chatId,
        'No pude publicar porque falta una migración en la base de datos (status=published). Aplica las migraciones nuevas y vuelve a intentarlo.'
      );
    }
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tupsicoana.com';
  const postUrl = `${siteUrl}/blog/${publishedSlug}`;
  revalidatePath('/blog');
  revalidatePath(`/blog/${publishedSlug}`);

  await answerCallbackQuery(token, callbackId, 'Publicado');
  await sendTelegramMessage(
    token,
    chatId,
    `Publicado con exito.\n\nTitulo: ${draft.title}\nURL: ${postUrl}`
  );
  await clearFlowAfterPublish(chatId);
}

async function updateLatestPendingDraftCoverFromPhoto(
  token: string,
  chatId: number,
  message: TelegramMessage,
  preferredDraftId: string | null = null
): Promise<boolean> {
  const latestCoverAsset = getLatestCoverAsset(message);
  if (!latestCoverAsset) return false;

  const supabase = createAdminClient();
  const latestDraft = await resolvePendingDraftForChat(chatId, preferredDraftId);

  if (!latestDraft) {
    await sendTelegramMessage(
      token,
      chatId,
      'Recibí la imagen, pero no encontré un borrador pendiente en este chat. Envíame primero el texto del blog y luego la portada.'
    );
    return true;
  }

  let coverUrl: string | null = null;
  try {
    coverUrl = await uploadCoverFromTelegram(token, latestCoverAsset, latestDraft.slug);
  } catch (error) {
    if (error instanceof Error && error.message === 'IMAGE_TOO_LARGE') {
      await sendTelegramMessage(
        token,
        chatId,
        'La imagen es demasiado pesada. Usa una portada menor a 400 KB para mantener el plan gratis.'
      );
      return true;
    }
    throw error;
  }

  const { error } = await supabase
    .from('blog_drafts')
    .update({ cover_url: coverUrl })
    .eq('id', latestDraft.id);

  if (error) {
    throw error;
  }

  await sendTelegramMessage(
    token,
    chatId,
    `Portada lista: "${latestDraft.title}". ¿Publicamos?`,
    { replyMarkup: publishKeyboard(latestDraft.id) }
  );

  return true;
}

export async function POST(request: Request) {
  try {
    const token = getRequiredEnv('TELEGRAM_BOT_TOKEN');
    const allowedChatIds = parseAllowedChatIds(getRequiredEnv('TELEGRAM_ALLOWED_CHAT_IDS'));
    const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;

    if (webhookSecret) {
      const receivedSecret = request.headers.get('x-telegram-bot-api-secret-token');
      if (receivedSecret !== webhookSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update = (await request.json()) as TelegramUpdate;
    if (update.callback_query) {
      await handleCallbackAction(token, update.callback_query);
      return NextResponse.json({ ok: true });
    }

    const message = update.message || update.edited_message;
    const chatId = message?.chat?.id;

    if (!message || typeof chatId !== 'number') {
      return NextResponse.json({ ok: true });
    }

    if (!allowedChatIds.has(chatId)) {
      await sendTelegramMessage(token, chatId, 'Este chat no está autorizado para crear borradores.');
      return NextResponse.json({ ok: true });
    }

    const incomingRaw = normalizeText(message.text || message.caption || '');
    const intent = await inferUserIntent(incomingRaw);

    if (intent === 'reset') {
      await upsertFlow(chatId, 'awaiting_content', null);
      await sendTelegramMessage(token, chatId, buildGuidedQuestionsMessage());
      return NextResponse.json({ ok: true });
    }

    if (intent === 'unpublish') {
      await unpublishDraftForChat(token, chatId, incomingRaw);
      await clearFlowAfterPublish(chatId);
      return NextResponse.json({ ok: true });
    }

    if (intent === 'unpublish_delete') {
      await unpublishAndDeleteDraftForChat(token, chatId, incomingRaw);
      await clearFlowAfterPublish(chatId);
      return NextResponse.json({ ok: true });
    }

    const flow = await getFlow(chatId);

    if (!incomingRaw && getLatestCoverAsset(message)) {
      const handled = await updateLatestPendingDraftCoverFromPhoto(
        token,
        chatId,
        message,
        flow.draft_id
      );
      if (handled) {
        await clearFlowAfterPublish(chatId);
      }
      return NextResponse.json({ ok: true });
    }

    if (flow.step === 'awaiting_image' && flow.draft_id && intent === 'no_image') {
      const supabase = createAdminClient();
      const { data: draftRow } = await supabase
        .from('blog_drafts')
        .select('title')
        .eq('id', flow.draft_id)
        .maybeSingle();
      const hint =
        (await getAssistantReply(
          `Sin foto. Máximo 220 caracteres, sin saludo: una línea tipo "Busca en Unsplash o Pexels" y 3 palabras clave breves separadas por comas, relacionadas con: "${draftRow?.title ?? 'bienestar emocional'}".`
        )) || 'Unsplash/Pexels: calma, pausa, naturaleza suave.';
      await sendTelegramMessage(token, chatId, `${hint}\n\n¿Publicamos?`, {
        replyMarkup: publishKeyboard(flow.draft_id),
      });
      await clearFlowAfterPublish(chatId);
      return NextResponse.json({ ok: true });
    }

    if (
      flow.step === 'awaiting_image' &&
      flow.draft_id &&
      intent === 'blog_content'
    ) {
      await updateDraftBodyFromText(flow.draft_id, incomingRaw);
      await sendTelegramMessage(
        token,
        chatId,
        'Texto actualizado. ¿Tienes imagen de portada? Envíala o escribe no.'
      );
      return NextResponse.json({ ok: true });
    }

    if (flow.step === 'awaiting_content') {
      if (intent === 'greeting') {
        await sendTelegramMessage(token, chatId, ANITA_INTRO);
        return NextResponse.json({ ok: true });
      }

      if (intent !== 'blog_content') {
        const reply = await getAssistantReply(incomingRaw);
        await sendTelegramMessage(
          token,
          chatId,
          reply || 'Pega aquí el texto completo del post cuando lo tengas.'
        );
        return NextResponse.json({ ok: true });
      }

      const inserted = await insertDraftFromMessage(token, chatId, message, incomingRaw);
      if (!inserted) {
        return NextResponse.json({ ok: true });
      }

      if (inserted.hadCover) {
        await sendTelegramMessage(
          token,
          chatId,
          `Guardado: "${inserted.title}". ¿Publicamos?`,
          { replyMarkup: publishKeyboard(inserted.id) }
        );
        await clearFlowAfterPublish(chatId);
      } else {
        await upsertFlow(chatId, 'awaiting_image', inserted.id);
        await sendTelegramMessage(
          token,
          chatId,
          `Guardado: "${inserted.title}". ¿Tienes imagen de portada? Envía la foto o escribe no.`
        );
      }
      return NextResponse.json({ ok: true });
    }

    const reply = await getAssistantReply(incomingRaw);
    await sendTelegramMessage(
      token,
      chatId,
      reply ||
        (flow.step === 'awaiting_image'
          ? 'Envía la imagen o escribe no.'
          : 'Pásame el texto del blog cuando puedas.')
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error en webhook de Telegram:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
