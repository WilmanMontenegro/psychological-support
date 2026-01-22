import BlogCard from './BlogCard';
import Link from 'next/link';

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

export default function BlogSection() {
  return (
    <section className="py-16 px-4 bg-tertiary-light">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-libre-baskerville text-accent mb-4">
            Blog
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Artículos y reflexiones sobre salud mental, bienestar emocional y crecimiento personal
          </p>
        </div>

        {/* Grid de artículos - centrado cuando hay pocos */}
        <div className={`grid gap-8 mb-8 ${
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

        {/* Botón ver más */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-block px-8 py-3 text-white rounded-lg font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            Ver todos los artículos
          </Link>
        </div>
      </div>

      {/* Bolitas decorativas */}
      <div className="absolute left-10 top-1/4 w-24 h-24 bg-primary opacity-15 rounded-full -z-10"></div>
      <div className="absolute right-10 bottom-1/4 w-32 h-32 bg-tertiary opacity-15 rounded-full -z-10"></div>
    </section>
  );
}
