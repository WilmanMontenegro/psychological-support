import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cómo decir &quot;NO&quot; sin sentirte culpable | Apoyo Psicológico',
  description: 'Aprende a establecer límites saludables, a decir no sin culpa y a reconocer que el autocuidado no es egoísmo. Una guía para fortalecer tu amor propio.',
  keywords: 'decir no, límites saludables, culpa, autocuidado, amor propio, asertividad, bienestar emocional',
  openGraph: {
    title: 'Cómo decir &quot;NO&quot; sin sentirte culpable',
    description: 'Estrategias prácticas para establecer límites sin sentir culpa. Descubre por qué decir no es un acto de amor propio.',
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/decir-no.jpeg`],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: 'Cómo decir &quot;NO&quot; sin sentirte culpable',
  description: 'Aprende a establecer límites saludables y a priorizar tu bienestar emocional sin sentir culpa.',
  image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/decir-no.jpeg`,
  datePublished: '2026-02-12',
  author: {
    '@type': 'Person',
    name: 'Tu Psico Ana',
  },
  keywords: 'decir no, límites, culpa, autocuidado, amor propio, asertividad',
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
                12 de febrero, 2026
              </span>
              <span className="flex items-center gap-2">
                <FaTag style={{ color: 'var(--color-secondary)' }} />
                Autoestima
              </span>
            </div>

            <SharePopover title='Cómo decir &quot;NO&quot; sin sentirte culpable' />
          </div>

          <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
            Cómo decir &quot;NO&quot; sin sentirte culpable
          </h1>
          <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
        </header>

        {/* Contenido */}
        <div className="prose prose-lg max-w-none text-justify">
          <p className="text-gray-700 leading-relaxed mb-8">
            Cuando intentamos decir &quot;no&quot;, nuestra amígdala cerebral activa una alerta cuyo objetivo es evitar el rechazo. Por eso, aprender a decir no de manera adecuada es tan importante. Cuando tendemos a aceptar todo para mantener contenta a la gente o evitar herir sus sentimientos, sin percatarnos de que al hacerlo provocamos un conflicto dentro de nosotros.
          </p>

          {/* Imagen integrada en el texto */}
          <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/images/blog/decir-no.jpeg"
              alt="Cómo decir no sin sentir culpa"
              width={1200}
              height={800}
              className="w-full h-auto"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            El conflicto de priorizar a otros antes que a ti
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Siempre que decimos que sí a algo solo para evitar una mala impresión, por temor al qué dirán o para agradar, estamos poniendo en primer lugar las prioridades y el tiempo ajeno, y nos estamos dejando de lado por completo. Decir no, no es egoísmo, es amor propio. No digas que sí por miedo, di no desde el respeto hacia ti.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            No siempre es necesario dar explicaciones, porque al justificarnos abrimos la puerta a que el otro cuestione nuestros límites. Frases como &quot;gracias por pensar en mí, pero en este momento no puedo&quot; pueden llevar a más preguntas; a veces, un no claro y firme es suficiente. El mundo no se va a acabar porque pongas un límite.
          </p>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            Reconocer la culpa como parte del proceso
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Muchas personas se sienten mal después de decir no, aun sabiendo que era necesario. Esa culpa aparece porque no estamos acostumbrados a respetar nuestros propios límites. Reconocerlo y trabajarlo es parte del proceso de cuidarnos y aprender a priorizarnos sin miedo. Decir no es, en el fondo, una forma de decirte sí a ti misma: sí a tu tiempo, a tu bienestar emocional, a tu energía y a tu paz.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            Cuando empiezas a respetar tus límites, enseñas a los demás cómo tratarte. Y aunque al inicio pueda generar incomodidad o culpa, con el tiempo se convierte en una herramienta poderosa de autocuidado y coherencia personal.
          </p>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            ¿Por qué aprendimos a sentir culpa?
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Una de las razones por las que sentimos culpa al decir no es porque aprendimos a asociar el valor personal con la complacencia. Desde que éramos niños nos inculcaron que ser un buen individuo significa estar siempre listo para ayudar y nunca causar molestias. Por esa razón, al responder negativamente, surge un pensamiento interno que nos acusa de equivocarnos, de ser egoístas o de fallarle a otra persona, a pesar de que con la lógica entendemos que es la decisión adecuada.
          </p>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            Aprender a tolerar la incomodidad
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Decir no sin sentir culpa implica aprender a tolerar esa incomodidad emocional sin retroceder. La culpa no siempre significa que estamos actuando mal; muchas veces solo indica que estamos rompiendo un patrón aprendido. Practicar respuestas claras, breves y respetuosas ayuda a fortalecer esta habilidad. No es necesario justificarse en exceso ni explicar de más: cuanto más breve y firme es el no, menos espacio hay para la duda o la negociación interna.
          </p>

          <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
            El poder de la coherencia personal
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            Con el tiempo, decir no se vuelve más sencillo porque entendemos que cuidar de nosotros no daña a los demás. Al contrario, cuando actuamos desde la coherencia y no desde la obligación, nuestras relaciones se vuelven más honestas. Decir no sin culpa es un ejercicio constante de autovalidación, donde aprendemos a confiar en nuestras decisiones y a respetar lo que necesitamos, incluso cuando al inicio resulte incómodo.
          </p>

          <div className="p-6 bg-secondary/5 rounded-xl border-l-4 border-secondary my-8">
            <p className="text-gray-800 font-semibold">
              💭 Recuerda: Cuando dices no desde el amor propio, estás diciendo sí a tu bienestar, tu paz y tu dignidad.
            </p>
          </div>
        </div>

        {/* Compartir */}
        <div className="my-12 py-8 border-t border-b border-gray-200">
          <p className="text-sm text-gray-600 mb-6 font-medium">¿Te gustó este artículo? Compártelo:</p>
          <ShareButtons title='Cómo decir &quot;NO&quot; sin sentirte culpable' />
        </div>

        {/* Comentarios */}
        <CommentsSection slug="como-decir-no-sin-sentir-culpa" />
      </article>
    </div>
  );
}
