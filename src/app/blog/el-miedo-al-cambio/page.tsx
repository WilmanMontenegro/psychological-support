import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

const title = 'El miedo al cambio: por qué nos cuesta evolucionar y cómo aprender a avanzar';
const imagePath = '/images/blog/el-miedo-al-cambio.jpg';
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com';

export const metadata: Metadata = {
  title: `${title} | Tu Psico Ana`,
  description:
    'El miedo al cambio es humano. Entiende por qué nos cuesta evolucionar, cuándo el temor nos limita y cómo avanzar con pasos pequeños y compasión.',
  keywords:
    'miedo al cambio, crecimiento personal, bienestar emocional, incertidumbre, autocuidado, evolución personal',
  openGraph: {
    type: 'article',
    title,
    description:
      'El miedo al cambio es humano. Aprende a avanzar aunque sientas incertidumbre, con pasos pequeños y más compasión hacia ti.',
    images: [
      {
        url: `${siteUrl}${imagePath}`,
        width: 1200,
        height: 800,
        alt: 'Mujer contemplando el horizonte desde una puerta abierta',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description:
      'El miedo al cambio es humano. Aprende a avanzar aunque sientas incertidumbre, con pasos pequeños y más compasión hacia ti.',
    images: [`${siteUrl}${imagePath}`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: title,
  description:
    'Reflexión sobre el miedo al cambio: por qué preferimos lo conocido, cuándo nos limita y cómo avanzar con valentía.',
  image: `${siteUrl}${imagePath}`,
  datePublished: '2026-06-26',
  author: {
    '@type': 'Person',
    name: 'Tu Psico Ana',
  },
  keywords: 'miedo al cambio, crecimiento personal, bienestar emocional, incertidumbre',
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
        <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:underline mb-8">
          <FaArrowLeft /> Volver al blog
        </Link>

        <header className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-2">
                <FaCalendar style={{ color: 'var(--color-secondary)' }} />
                26 de junio, 2026
              </span>
              <span className="flex items-center gap-2">
                <FaTag style={{ color: 'var(--color-secondary)' }} />
                Crecimiento Personal
              </span>
            </div>

            <SharePopover title={title} />
          </div>

          <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">{title}</h1>
          <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
        </header>

        <div className="prose prose-lg max-w-none [&>p]:text-justify">
          <p className="text-gray-700 leading-relaxed mb-8">
            Hay algo curioso de nosotros los seres humanos: muchas veces preferimos quedarnos en lo conocido,
            incluso cuando eso ya no nos hace felices, simplemente porque nos resulta familiar.
          </p>

          <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={imagePath}
              alt="Mujer sentada en el umbral de una puerta abierta, contemplando el horizonte al atardecer"
              width={1200}
              height={800}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-8">
            Nos aferramos a relaciones, trabajos, rutinas, lugares o versiones de nosotros mismos que ya no nos
            representan, no porque sean lo mejor para nosotros, sino porque <strong>lo desconocido genera miedo</strong>.
            Y es completamente humano sentirlo.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            El cambio significa despedirse de algo que ya conocemos para abrirle la puerta a algo que aún no
            sabemos cómo será. Ahí aparece la incertidumbre, las dudas y esa voz interna que nos pregunta:{' '}
            <em>&ldquo;¿Y si no sale bien?&rdquo;</em>
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Pero también podríamos preguntarnos: <strong>¿Y si sí?</strong>
          </p>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4 clear-none">
            🧠 ¿Por qué nos cuesta tanto cambiar?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Nuestro cerebro busca protegernos y, muchas veces, interpreta lo familiar como seguro. Por eso, aunque
            una situación nos genere malestar, podemos permanecer en ella porque ya sabemos cómo manejarla.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Además, desde una mirada psicosocial, nuestra historia de vida, la educación que recibimos, nuestras
            experiencias y los mensajes de nuestro entorno también influyen en cómo enfrentamos los cambios. Muchas
            veces crecimos escuchando que equivocarnos era fracasar, cuando en realidad equivocarnos también es
            parte de aprender.
          </p>

          <div className="p-6 bg-secondary/5 rounded-xl border-l-4 border-secondary my-8">
            <p className="text-gray-800 font-semibold">
              💭 El miedo al cambio no significa que seas débil o que no seas capaz; muchas veces significa
              simplemente que estás frente a algo nuevo.
            </p>
          </div>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            ⚠️ ¿Cuándo el miedo deja de protegerte y empieza a limitarte?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            El miedo tiene una función importante: prepararnos y alertarnos ante posibles riesgos. Sin embargo, se
            convierte en un obstáculo cuando nos mantiene en lugares donde ya no estamos creciendo, cuando nos hace
            posponer decisiones importantes o cuando permitimos que el temor tenga más voz que nuestros deseos y
            necesidades.
          </p>

          <div className="p-6 bg-red-50 rounded-xl border-l-4 border-red-500 my-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Señal de alerta</h3>
            <p className="text-gray-700">
              A veces no estamos estancados porque no podamos avanzar, sino porque estamos esperando sentirnos
              completamente seguros para hacerlo. Y la realidad es que muchos cambios importantes llegan antes de
              sentirnos preparados.
            </p>
          </div>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            🌱 ¿Cómo avanzar aunque tengas miedo?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            La valentía no consiste en no sentir miedo, sino en <strong>decidir caminar a pesar de él</strong>.
            Algunos pequeños pasos que pueden ayudarte son:
          </p>

          <ul className="space-y-4 mb-8 not-prose">
            <li className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="shrink-0">✨</span>
              <span>
                <strong>Escucha lo que sientes:</strong> En lugar de pelear con tu miedo, pregúntate qué quiere
                decirte y qué necesita de ti.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="shrink-0">✨</span>
              <span>
                <strong>Cuestiona tus pensamientos:</strong> No todo lo que piensas es una realidad. A veces nuestra
                mente imagina escenarios negativos para intentar protegernos.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="shrink-0">✨</span>
              <span>
                <strong>Da pasos pequeños:</strong> No necesitas cambiar tu vida de un día para otro. Los cambios
                grandes también empiezan con decisiones pequeñas.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="shrink-0">✨</span>
              <span>
                <strong>Recuerda todo lo que ya has superado:</strong> Mira hacia atrás y reconoce cuántas veces
                tuviste miedo y aun así encontraste la manera de seguir.
              </span>
            </li>
            <li className="flex gap-3 text-gray-700 leading-relaxed">
              <span className="shrink-0">✨</span>
              <span>
                <strong>Háblate con más compasión:</strong> Cambia el &ldquo;no puedo&rdquo; por un &ldquo;voy a
                intentarlo&rdquo; o &ldquo;puedo aprender en el proceso&rdquo;.
              </span>
            </li>
          </ul>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            🩷 Una reflexión para llevar contigo
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Quizás el cambio que tanto miedo te da hoy sea justamente el camino que te acerque a una versión de tu
            vida más tranquila, más auténtica y más alineada contigo.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            No necesitas tener todas las respuestas antes de empezar. No necesitas sentirte completamente lista o
            listo para dar el primer paso. A veces, crecer también significa confiar en que podrás construir el
            camino mientras avanzas.
          </p>

          <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500 my-8">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✨ Para reflexionar hoy</h3>
            <p className="text-gray-700">
              ¿Qué cambio estás evitando por miedo y qué podría pasar si te permitieras intentarlo?
            </p>
          </div>
        </div>

        <div className="my-12 py-8 border-t border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-6 font-medium">¿Te gustó este artículo? Compártelo:</p>
          <ShareButtons title={title} />
        </div>

        <CommentsSection slug="el-miedo-al-cambio" />
      </article>
    </div>
  );
}
