import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';
import { blogPosts } from '@/lib/blogData';

export const metadata: Metadata = {
  title: "Blog de bienestar emocional | Tu Psico Ana",
  description: "Artículos sobre bienestar emocional, autocuidado y crecimiento personal desde una mirada educativa y cercana.",
  keywords: "bienestar emocional, autocuidado, salud mental, crecimiento personal, blog emocional, psicóloga en formación",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog de bienestar emocional",
  description: "Artículos educativos sobre salud mental, bienestar emocional y crecimiento personal",
  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/blog`,
};

const postsToRender = [...blogPosts]
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-pastel-light">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-libre-baskerville text-accent mb-4">
            Blog de Bienestar Emocional
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Artículos, reflexiones y consejos prácticos sobre salud mental, bienestar emocional y crecimiento personal desde una perspectiva educativa.
          </p>
        </div>

        {/* Grid de artículos - centrado cuando hay pocos */}
        <div className={`grid gap-8 ${postsToRender.length === 1
          ? 'max-w-md mx-auto'
          : postsToRender.length === 2
            ? 'md:grid-cols-2 max-w-4xl mx-auto'
            : 'md:grid-cols-2 lg:grid-cols-3'
          }`}>
          {postsToRender.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
