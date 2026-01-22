import BlogCard from '@/components/BlogCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Blog de Acompañamiento Psicológico y Coaching Emocional | Salud Mental",
  description: "Artículos sobre acompañamiento psicológico, coaching emocional, manejo de emociones, apoyo emocional y bienestar mental. Consejos prácticos de salud mental.",
  keywords: "acompañamiento psicológico, coaching emocional, salud mental, manejo de emociones, bienestar emocional, apoyo emocional, inteligencia emocional, crecimiento personal",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog de Acompañamiento Psicológico",
  description: "Artículos sobre salud mental, bienestar emocional y apoyo psicológico",
  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/blog`,
};

const blogPosts = [
  {
    slug: 'como-construir-el-amor-propio',
    title: 'Cómo construir el amor propio en nuestra vida cotidiana',
    excerpt: 'El amor propio no es perfección ni sentirse bien siempre; es cómo te hablas, te cuidas, te respetas y pones límites. Aquí te comparto pasos prácticos para acompañarte sin abandonarte.',
    image: '/images/blog/como-construir-el-amor-propio/amorpropio.jpeg',
    category: 'Autoestima',
    date: '2026-01-22'
  },
  {
    slug: 'aprendamos-a-identificar-y-manejar-nuestras-emociones',
    title: 'Aprendamos a identificar y sobre todo a manejar nuestras emociones',
    excerpt: 'Cuando pensamos que manejar nuestras emociones significa mantenerlas ocultas, que nadie sepa cómo te sientes, o cuando te haces el fuerte cuando estás triste, eso se llama fingir que no existen. Saber manejar las emociones no se trata de ignorarlas, sino de reconocerlas...',
    image: '/images/blog/aprendamos-a-identificar-y-manejar-nuestras-emociones/portada.jpg',
    category: 'Bienestar',
    date: '2025-10-17'
  }
];

const postsToRender = [...blogPosts]
  .sort((a, b) => (a.date < b.date ? 1 : -1))
  .slice(0, 3);

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
            Blog de Apoyo Psicológico
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Artículos, reflexiones y consejos prácticos sobre salud mental, bienestar emocional y acompañamiento psicológico. Descubre cómo mejorar tu apoyo emocional y crecimiento personal.
          </p>
        </div>

        {/* Grid de artículos - centrado cuando hay pocos */}
        <div className={`grid gap-8 ${
          postsToRender.length === 1
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
