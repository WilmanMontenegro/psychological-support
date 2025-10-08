import BlogCard from '@/components/BlogCard';

const blogPosts = [
  {
    slug: 'aprendamos-a-identificar-y-manejar-nuestras-emociones',
    title: 'Aprendamos a identificar y sobre todo a manejar nuestras emociones',
    excerpt: 'Cuando pensamos que manejar nuestras emociones significa mantenerlas ocultas, que nadie sepa cómo te sientes, o cuando te haces el fuerte cuando estás triste, eso se llama fingir que no existen. Saber manejar las emociones no se trata de ignorarlas, sino de reconocerlas...',
    image: '/images/blog/aprendamos-a-identificar-y-manejar-nuestras-emociones/portada.jpg',
    category: 'Bienestar',
    date: '2025-01-15'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-pastel-light">
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-libre-baskerville text-accent mb-4">
            Blog
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Artículos y reflexiones sobre salud mental, bienestar emocional y crecimiento personal
          </p>
        </div>

        {/* Grid de artículos - centrado cuando hay pocos */}
        <div className={`grid gap-8 ${
          blogPosts.length === 1
            ? 'max-w-md mx-auto'
            : blogPosts.length === 2
            ? 'md:grid-cols-2 max-w-4xl mx-auto'
            : 'md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
}
