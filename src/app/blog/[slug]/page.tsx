import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import CommentsSection from '@/components/CommentsSection';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import { getPublishedDraftBySlug } from '@/lib/blogDrafts';

type Props = {
  params: Promise<{ slug: string }>;
};

type CalloutKind = 'success' | 'warning' | 'note';

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

function isLikelyHeading(paragraph: string): boolean {
  const clean = paragraph.trim();
  if (!clean) return false;
  if (clean.length > 80) return false;
  if (clean.includes(':')) return false;
  if (/[.!?]$/.test(clean)) return false;
  if (clean.startsWith('✅') || clean.startsWith('⚠') || clean.startsWith('💭')) return false;
  if (/^recuerda:/i.test(clean)) return false;

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 3 || words.length > 10) return false;

  const lower = clean.toLowerCase();
  const headingHints = [
    'mensaje final',
    'aprender',
    'estrategias',
    'qué es',
    'que es',
    'cómo',
    'como',
    'por qué',
    'porque',
    'diferencia',
    'señales',
    'pasos',
    'claves',
    'recuerda',
  ];

  return headingHints.some((hint) => lower.includes(hint));
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
              {index === 1 ? (
                <div
                  className={`mb-8 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg ${
                    inlineSide === 'left' ? 'float-left mr-6' : 'float-right ml-6'
                  }`}
                >
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    width={1200}
                    height={800}
                    className="w-full h-auto"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : null}
              {(() => {
                const callout = detectCallout(paragraph);
                if (!callout) {
                  if (isLikelyHeading(paragraph)) {
                    return (
                      <h2 className="text-2xl md:text-[2.05rem] leading-tight font-libre-baskerville text-accent mt-12 mb-5">
                        {paragraph}
                      </h2>
                    );
                  }
                  return (
                    <p className="text-gray-700 leading-relaxed mb-8" style={{ textAlign: 'justify' }}>
                      {paragraph}
                    </p>
                  );
                }

                const hasBody = Boolean(callout.body);
                return (
                  <div className={`p-6 rounded-xl border-l-4 my-8 ${getCalloutStyles(callout.kind)}`}>
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
