import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Cómo construir el amor propio en nuestra vida cotidiana | Apoyo Psicológico",
  description: "Guía práctica para fortalecer el amor propio en la vida cotidiana: cuidados, límites, autoconocimiento y acompañamiento emocional.",
  keywords: "amor propio, autoestima, crecimiento personal, bienestar emocional, limites saludables, acompañamiento emocional",
  openGraph: {
    type: 'article',
    title: "Cómo construir el amor propio en nuestra vida cotidiana",
    description: "Pasos prácticos para cultivar el amor propio y el autocuidado en tu día a día",
    images: [{
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/amor-propio.jpeg`,
      width: 1200,
      height: 800,
      alt: "Cómo construir el amor propio",
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Cómo construir el amor propio en nuestra vida cotidiana",
    description: "Pasos prácticos para cultivar el amor propio y el autocuidado en tu día a día",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/amor-propio.jpeg`],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Cómo construir el amor propio en nuestra vida cotidiana",
  description: "Claves prácticas para cultivar el amor propio, establecer límites y acompañarte con empatía.",
  image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/amor-propio.jpeg`,
  datePublished: "2026-01-22",
  author: {
    "@type": "Person",
    name: "Tu Psico Ana",
  },
  keywords: "amor propio, autoestima, autocuidado, limites saludables, bienestar emocional",
};

export default function BlogPost() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:underline mb-8">
          <FaArrowLeft /> Volver al blog
        </Link>

        {/* Encabezado */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaCalendar style={{ color: 'var(--color-secondary)' }} />
                22 de enero, 2026
              </span>
              <span className="flex items-center gap-2">
                <FaTag style={{ color: 'var(--color-secondary)' }} />
                Autoestima
              </span>
            </div>

            <SharePopover title="Cómo construir el amor propio en nuestra vida cotidiana" />
          </div>

          <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
            Cómo construir el amor propio en nuestra vida cotidiana
          </h1>
          <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
        </header>

        {/* Contenido */}
        <div className="prose prose-lg max-w-none text-justify">
          <p className="text-gray-700 leading-relaxed mb-8">
            Hoy hablaremos sobre el amor propio, sobre cómo complementarlo en nuestro día a día y, sobre todo, en cómo manejarlo de una manera adecuada.
          </p>

          {/* Imagen integrada en el texto */}
          <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/blog/amor-propio.jpeg"
              alt="Amor propio en la vida cotidiana"
              width={1200}
              height={800}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-8">
            ¿Qué es el amor propio? Esa palabra que escuchamos a diario tanto en redes sociales como en nuestra cotidianidad, que en la mayoría de las veces no sabemos qué significa. Y es que esa palabra es la clave para mejorar como persona.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Amor propio no es sentirse bien todo el tiempo, ni tener la autoestima perfecta o &quot;sobre las nubes&quot;. Es la forma en que nos relacionamos con nosotros mismos: en cómo nos cuidamos, en cómo nos hablamos, en cómo nos respetamos y, sobre todo, en cómo nos acompañamos en nuestro proceso. Es estar contigo sin abandonarte.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            El amor propio no es solo verte bonita; también es crecer como persona y de manera profesional. Es poner límites sin dar explicaciones, reconocer las emociones incómodas sin juzgarlas y priorizarte sin dejar de ser empática con los demás.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            El amor propio no es solo autoestima, también es confianza. Mejorar el amor propio es preguntarte a ti misma: ¿Qué tal te sentiste hoy? ¿Qué puedo mejorar? ¿Qué puedo hacer por mí?
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            El amor propio también puede fortalecerse en comunidad. A veces, compartir experiencias y escuchar otras miradas ayuda a comprender mejor lo que sentimos y a sostener hábitos de cuidado personal.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 font-semibold">
            Si este tema resonó contigo, te invito a seguir leyendo, comentar en el blog y construir conversación con respeto.
          </p>
        </div>

        <ShareButtons
          title="Cómo construir el amor propio en nuestra vida cotidiana"
        />

        {/* Call to action */}
        <div className="mt-12 p-8 bg-pastel-light rounded-2xl text-center">
          <h3 className="text-2xl font-libre-baskerville text-accent mb-4">
            ¿Quieres seguir aprendiendo sobre amor propio?
          </h3>
          <p className="text-gray-600 mb-6">
            Si deseas sugerir temas o proponer una colaboración, puedes escribirme por el formulario de contacto.
          </p>
          <Link
            href="/contactame"
            className="inline-block px-8 py-3 text-white rounded-lg font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            Ir a contacto
          </Link>
        </div>

        <div className="mt-8">
          <CommentsSection slug="como-construir-el-amor-propio" />
        </div>

        {/* Botón volver abajo */}
        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:underline">
            <FaArrowLeft /> Volver al blog
          </Link>
        </div>
      </article>
    </div>
  );
}
