import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import CommentsSection from '@/components/CommentsSection';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import { getPublishedDraftBySlug } from '@/lib/blogDrafts';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

type CalloutKind = 'success' | 'warning' | 'note';
type AutoCallout = {
  index: number;
  kind: CalloutKind;
  title: string;
};
const IMAGE_PARAGRAPH_MIN = 220;

function formatDate(dateInput: string) {
  return new Date(dateInput).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function detectCallout(paragraph: string): { kind: CalloutKind; title: string; body: string } | null {
  const clean = paragraph.trim();

  if (clean.startsWith('✅')) {
    const content = clean.replace(/^✅\s*/, '');
    const [title, ...rest] = content.split(':');
    return { kind: 'success', title: title.trim(), body: rest.join(':').trim() };
  }

  if (clean.startsWith('⚠️') || clean.startsWith('⚠')) {
    const content = clean.replace(/^⚠️?\s*/, '');
    const [title, ...rest] = content.split(':');
    return { kind: 'warning', title: title.trim(), body: rest.join(':').trim() };
  }

  if (clean.startsWith('💭') || clean.toLowerCase().startsWith('recuerda:')) {
    const content = clean.replace(/^💭\s*/, '');
    const [title, ...rest] = content.split(':');
    return { kind: 'note', title: title.trim(), body: rest.join(':').trim() };
  }

  return null;
}

function getCalloutStyles(kind: CalloutKind): string {
  if (kind === 'success') return 'bg-green-50 border-green-500 text-green-800';
  if (kind === 'warning') return 'bg-red-50 border-red-500 text-red-800';
  return 'bg-secondary/5 border-secondary text-gray-800';
}

function countWords(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function isExplicitCallout(paragraph: string): boolean {
  return Boolean(detectCallout(paragraph));
}

function findImageParagraphIndex(paragraphs: string[]): number {
  const preferredIndex = paragraphs.findIndex((paragraph) => {
    if (isExplicitCallout(paragraph)) return false;
    return paragraph.length >= IMAGE_PARAGRAPH_MIN || countWords(paragraph) >= 34;
  });

  return preferredIndex === -1 ? Math.min(1, paragraphs.length - 1) : preferredIndex;
}

function calloutCandidateScore(paragraph: string): number {
  const clean = paragraph.trim();
  const lower = clean.toLowerCase();
  if (clean.length < 70 || clean.length > 280) return 0;
  if (isExplicitCallout(clean)) return 0;

  const hints = [
    'no tienes que',
    'no se trata',
    'lo importante',
    'es importante',
    'la clave',
    'tu bienestar',
    'autocuidado',
    'poner límites',
    'poner limites',
    'paso a paso',
    'pedir ayuda',
    'no estás sola',
    'no estas sola',
    'escucharte',
    'descanso',
    'respirar',
    'respiración',
    'respiracion',
    'presente',
    'celular',
    'redes sociales',
    'no es tu enemigo',
    'ayuda profesional',
  ];

  return hints.reduce((score, hint) => (lower.includes(hint) ? score + 1 : score), 0);
}

function getAutoCalloutMeta(paragraph: string): Pick<AutoCallout, 'kind' | 'title'> {
  const lower = paragraph.toLowerCase();

  if (
    lower.includes('redes') ||
    lower.includes('alerta') ||
    lower.includes('celular') ||
    lower.includes('agotad') ||
    lower.includes('no tienes que poder') ||
    lower.includes('sobrepas')
  ) {
    return { kind: 'warning', title: '⚠️ Ten presente' };
  }

  if (
    lower.includes('autocuidado') ||
    lower.includes('poner límites') ||
    lower.includes('poner limites') ||
    lower.includes('paso a paso') ||
    lower.includes('pedir ayuda') ||
    lower.includes('escucharte') ||
    lower.includes('respirar') ||
    lower.includes('respiración') ||
    lower.includes('respiracion') ||
    lower.includes('presente') ||
    lower.includes('descanso')
  ) {
    return { kind: 'success', title: '✅ Práctica de cuidado' };
  }

  return { kind: 'note', title: '✨ Recuerda' };
}

function findAutoCallouts(paragraphs: string[], imageIndex: number): AutoCallout[] {
  return paragraphs
    .map((paragraph, index) => ({ index, score: calloutCandidateScore(paragraph) }))
    .filter(({ index, score }) => score > 0 && index !== 0 && index !== imageIndex)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, 2)
    .map(({ index }) => ({ index, ...getAutoCalloutMeta(paragraphs[index]) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedDraftBySlug(slug);
  if (!post) {
    return {};
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tupsicoana.com';
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`;
  const imageUrl = post.cover_url || `${siteUrl}/images/blog/pensamientos-intrusivos.jpg`;
  const seoTitle = post.seo_title || `${post.title} | Tu Psico Ana`;
  const seoDescription = post.seo_description || post.excerpt;

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      type: 'article',
      title: seoTitle,
      description: seoDescription,
      url: canonicalUrl,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DynamicBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedDraftBySlug(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tupsicoana.com';
  const imageUrl = post.cover_url || `${siteUrl}/images/blog/pensamientos-intrusivos.jpg`;
  const inlineSide = post.inline_image_side || 'right';
  const paragraphs = post.content_raw
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
  const imageParagraphIndex = findImageParagraphIndex(paragraphs);
  const autoCallouts = findAutoCallouts(paragraphs, imageParagraphIndex);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo_description || post.excerpt,
    image: imageUrl,
    datePublished: post.published_at || post.created_at,
    author: {
      '@type': 'Person',
      name: 'Tu Psico Ana',
    },
    keywords: post.category,
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto">
        <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:underline mb-8">
          <FaArrowLeft /> Volver al blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaCalendar style={{ color: 'var(--color-secondary)' }} />
                {formatDate(post.published_at || post.created_at)}
              </span>
              <span className="flex items-center gap-2">
                <FaTag style={{ color: 'var(--color-secondary)' }} />
                {post.category}
              </span>
            </div>
            <SharePopover title={post.title} />
          </div>

          <h1 className="text-3xl md:text-5xl leading-tight md:leading-tight font-libre-baskerville text-accent mb-6">
            {post.title}
          </h1>
          <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
        </header>

        <div className="prose prose-lg max-w-none">
          {paragraphs.map((paragraph, index) => (
            <div key={`${post.id}-${index}`}>
              {(() => {
                const callout = detectCallout(paragraph);

                if (index === imageParagraphIndex && !callout) {
                  const imageFloatClass =
                    inlineSide === 'left'
                      ? 'md:float-left md:mr-7'
                      : 'md:float-right md:ml-7';

                  return (
                    <>
                      <div
                        className={`not-prose float-none mb-5 w-full md:mb-4 md:w-[42%] rounded-2xl overflow-hidden shadow-lg ${imageFloatClass}`}
                      >
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          width={1200}
                          height={800}
                          className="w-full h-auto"
                          sizes="(max-width: 768px) 100vw, 42vw"
                        />
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-6" style={{ textAlign: 'justify' }}>
                        {paragraph}
                      </p>
                    </>
                  );
                }

                if (!callout) {
                  const autoCallout = autoCallouts.find((item) => item.index === index);
                  if (autoCallout) {
                    return (
                      <div className={`p-5 rounded-xl border-l-4 my-6 ${getCalloutStyles(autoCallout.kind)}`}>
                        <h3 className="text-lg font-semibold mb-2">{autoCallout.title}</h3>
                        <p className="text-gray-700" style={{ textAlign: 'justify' }}>
                          {paragraph}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <p className="text-gray-700 leading-relaxed mb-6" style={{ textAlign: 'justify' }}>
                      {paragraph}
                    </p>
                  );
                }

                const hasBody = Boolean(callout.body);
                return (
                  <div className={`p-5 rounded-xl border-l-4 my-6 ${getCalloutStyles(callout.kind)}`}>
                    <h3 className="text-lg font-semibold mb-2">
                      {callout.kind === 'success' ? '✅ ' : callout.kind === 'warning' ? '⚠️ ' : '💭 '}
                      {callout.title}
                    </h3>
                    {hasBody ? (
                      <p className="text-gray-700" style={{ textAlign: 'justify' }}>
                        {callout.body}
                      </p>
                    ) : null}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
        <div className="clear-both my-12 py-8 border-t border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-6 font-medium">¿Te gustó este artículo? Compártelo:</p>
          <ShareButtons title={post.title} />
        </div>

        <CommentsSection slug={post.slug} />
      </article>
    </div>
  );
}
