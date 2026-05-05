import { NextResponse } from 'next/server';
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

type TelegramMessage = {
  message_id: number;
  chat?: { id?: number };
  text?: string;
  caption?: string;
  photo?: TelegramPhoto[];
};

type TelegramUpdate = {
  update_id: number;
  message?: TelegramMessage;
  edited_message?: TelegramMessage;
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
};

function isAllowedCategory(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(categoryRules, value);
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
              'Eres editor de un blog de bienestar emocional. Devuelve solo JSON válido con campos: title, excerpt, category. No agregues ningún texto fuera del JSON. category debe ser exactamente una de: Salud Mental, Autoestima, Maternidad, Bienestar.',
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

    return result;
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
                text: 'Eres editor de un blog de bienestar emocional. Devuelve solo JSON valido con campos: title, excerpt, category. category debe ser exactamente una de: Salud Mental, Autoestima, Maternidad, Bienestar.',
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

    return result;
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

  const firstLine = lines[0] || `Borrador ${new Date().toISOString().slice(0, 10)}`;
  const title = firstLine.replace(/^titulo:\s*/i, '').slice(0, 140);
  const slugBase = slugify(title || firstLine);
  const slug = slugBase || `borrador-${Date.now()}`;
  const excerptSource = lines[1] || rawContent || title;
  const excerpt = excerptSource.slice(0, 220);
  const contentRaw = rawContent || title;

  return {
    title,
    slug,
    excerpt,
    contentRaw,
    category: inferCategory(`${title}\n${contentRaw}`),
  };
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
  photo: TelegramPhoto | undefined,
  slug: string
): Promise<string | null> {
  if (!photo) return null;
  if (photo.file_size && photo.file_size > MAX_COVER_FILE_SIZE_BYTES) {
    throw new Error('IMAGE_TOO_LARGE');
  }

  const fileResult = await telegramRequest<{ file_path: string }>(token, 'getFile', {
    file_id: photo.file_id,
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
  const extension = contentType.includes('png') ? 'png' : 'jpg';
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

async function sendTelegramMessage(token: string, chatId: number, text: string) {
  try {
    await telegramRequest(token, 'sendMessage', {
      chat_id: chatId,
      text,
    });
  } catch (error) {
    console.error('No se pudo enviar respuesta a Telegram:', error);
  }
}

function getLatestPhoto(message: TelegramMessage): TelegramPhoto | undefined {
  if (!message.photo || message.photo.length === 0) return undefined;
  return message.photo[message.photo.length - 1];
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
    const message = update.message || update.edited_message;
    const chatId = message?.chat?.id;

    if (!message || typeof chatId !== 'number') {
      return NextResponse.json({ ok: true });
    }

    if (!allowedChatIds.has(chatId)) {
      await sendTelegramMessage(token, chatId, 'Este chat no está autorizado para crear borradores.');
      return NextResponse.json({ ok: true });
    }

    const parsedDraft = parseDraftContent(message);
    const aiDraft = await improveDraftWithAi(parsedDraft.contentRaw, {
      title: parsedDraft.title,
      excerpt: parsedDraft.excerpt,
      category: parsedDraft.category,
    });

    const title = aiDraft?.title || parsedDraft.title;
    const excerpt = aiDraft?.excerpt || parsedDraft.excerpt;
    const category = aiDraft?.category || parsedDraft.category;
    const slug = slugify(title) || parsedDraft.slug;
    const contentRaw = parsedDraft.contentRaw;
    let coverUrl: string | null = null;
    try {
      coverUrl = await uploadCoverFromTelegram(token, getLatestPhoto(message), slug);
    } catch (error) {
      if (error instanceof Error && error.message === 'IMAGE_TOO_LARGE') {
        await sendTelegramMessage(
          token,
          chatId,
          'La imagen es demasiado pesada. Usa una portada menor a 400 KB para mantener el plan gratis.'
        );
        return NextResponse.json({ ok: true });
      }
      throw error;
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from('blog_drafts').insert({
      title,
      slug,
      excerpt,
      content_raw: contentRaw,
      category,
      cover_url: coverUrl,
      status: 'pending',
      source_chat_id: chatId,
      source_message_id: message.message_id,
    });

    if (error) {
      const duplicate = error.message.toLowerCase().includes('duplicate');
      if (duplicate) {
        await sendTelegramMessage(token, chatId, `Este mensaje ya fue procesado para el borrador "${slug}".`);
        return NextResponse.json({ ok: true });
      }
      throw error;
    }

    await sendTelegramMessage(
      token,
      chatId,
      `Borrador recibido.\n\nTitulo: ${title}\nCategoria: ${category}\nEstado: pending${
        aiDraft ? '\nMejora IA: activa' : '\nMejora IA: no configurada'
      }`
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error en webhook de Telegram:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
