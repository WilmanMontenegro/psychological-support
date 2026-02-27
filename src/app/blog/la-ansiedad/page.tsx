import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'La ansiedad: Cuándo es normal y cuándo buscar ayuda | Apoyo Psicológico',
    description: 'Entiende qué es la ansiedad, cuándo es adaptativa y cuándo se vuelve patológica. Aprende a identificar las señales y manejarla mejor.',
    keywords: 'ansiedad, estrés, salud mental, ansiedad adaptativa, ansiedad patológica, manejo de ansiedad, bienestar emocional',
    openGraph: {
        title: 'La ansiedad: Cuándo es normal y cuándo buscar ayuda',
        description: 'Entiende qué es la ansiedad, cuándo es adaptativa y cuándo se vuelve patológica. Aprende a identificar las señales y manejarla mejor.',
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/la-ansiedad.jpg`],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'La ansiedad: Cuándo es normal y cuándo buscar ayuda',
    description: 'Entiende qué es la ansiedad, cuándo es adaptativa y cuándo se vuelve patológica. Aprende a identificar las señales y manejarla mejor.',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/la-ansiedad.jpg`,
    datePublished: '2026-02-26',
    author: {
        '@type': 'Person',
        name: 'Tu Psico Ana',
    },
    keywords: 'ansiedad, estrés, salud mental, ansiedad adaptativa, bienestar',
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
                                26 de febrero, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTag style={{ color: 'var(--color-secondary)' }} />
                                Salud Mental
                            </span>
                        </div>

                        <SharePopover title='La ansiedad: Cuándo es normal y cuándo buscar ayuda' />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
                        La ansiedad: Cuándo es normal y cuándo buscar ayuda
                    </h1>
                    <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
                </header>

                {/* Contenido */}
                <div className="prose prose-lg max-w-none text-justify">
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Hoy quiero hablar de un tema muy importante en la actualidad y que, en algún momento, todos hemos vivido: <strong>la ansiedad</strong>. Todos hemos sentido ansiedad, aunque sea mínima. Por ejemplo, cuando tenemos una presentación en la universidad o en el colegio. En ese momento, nuestra amígdala cerebral activa la alerta de huida porque empezamos a pensar que lo vamos a hacer mal, que se van a burlar o que nos vamos a equivocar. Entonces entramos en un estado de ansiedad y nuestra mente comienza a imaginar miles de escenarios… y casi todos terminan mal.
                    </p>

                    {/* Imagen integrada en el texto */}
                    <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/images/blog/la-ansiedad.jpg"
                            alt="Persona con ansiedad"
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        ¿Qué es la ansiedad?
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        La ansiedad, en esencia, es un <strong>mecanismo de defensa</strong>. Es una respuesta natural del organismo que se activa para prepararnos ante un posible peligro. Nuestro cuerpo se pone en modo &ldquo;lucha o huida&rdquo; para protegernos. El problema es que muchas veces ese peligro no es real, sino que está en nuestra mente. La ansiedad suele aparecer cuando pensamos demasiado en el futuro, en lo que podría pasar, en cómo reaccionarán los demás o en si estaremos a la altura.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Es importante entender que no toda ansiedad es negativa. Existe la <strong>ansiedad adaptativa</strong>, que es eventual y específica. Tiene un inicio y un final, y suele aparecer ante situaciones reales, como un examen, una entrevista o una exposición. Esta ansiedad incluso puede ayudarnos, porque nos mantiene atentos, concentrados y preparados para responder mejor.
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        Ansiedad adaptativa vs. ansiedad patológica
                    </h2>

                    <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500 my-8">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Ansiedad Adaptativa</h3>
                        <p className="text-gray-700">
                            Es <strong>eventual y específica</strong>. Tiene un inicio y un final claro. Aparece ante situaciones reales y concretas como exámenes, entrevistas o presentaciones. Nos mantiene alerta y puede mejorar nuestro rendimiento.
                        </p>
                    </div>

                    <div className="p-6 bg-red-50 rounded-xl border-l-4 border-red-500 my-8">
                        <h3 className="text-lg font-semibold text-red-800 mb-2">⚠️ Ansiedad Patológica</h3>
                        <p className="text-gray-700">
                            Es <strong>persistente y generalizada</strong>. Se mantiene como un estado de alerta casi permanente, incluso cuando no hay peligro real. Genera preocupaciones constantes, pensamientos catastróficos, respuestas exageradas y afecta el rendimiento, el descanso y la calidad de vida.
                        </p>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Cuando la ansiedad se vuelve patológica, puede manifestarse de muchas formas: dificultad para dormir, tensión muscular, fatiga, problemas de concentración, irritabilidad, y en casos más severos, ataques de pánico. Es cuando la preocupación se apodera de nuestros días y nos impide funcionar con normalidad.
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        Aprender a reconocerla y manejarla
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        La clave no es eliminar la ansiedad, porque es una emoción humana, sino <strong>aprender a identificar cuándo nos está ayudando y cuándo nos está sobrepasando</strong>. Entenderla nos permite manejarla mejor y no dejar que el miedo al futuro controle nuestro presente.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Algunas estrategias que pueden ayudarte incluyen: enfocarte en el presente en lugar de anticipar lo peor, practicar técnicas de respiración consciente, identificar qué pensamientos disparan tu ansiedad, establecer rutinas que te den estabilidad, y permitirte buscar ayuda profesional cuando sientes que la ansiedad te supera.
                    </p>

                    <div className="p-6 bg-secondary/5 rounded-xl border-l-4 border-secondary my-8">
                        <p className="text-gray-800 font-semibold">
                            💭 Recuerda: La ansiedad es parte de la experiencia humana. No se trata de eliminarla, sino de aprender a reconocerla, entenderla y gestionarla para que no controle tu vida.
                        </p>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Si sientes que la ansiedad te está afectando de manera constante, que interfiere con tu día a día o que no puedes controlarla por ti mismo, es momento de buscar apoyo profesional. No estás solo en esto, y pedir ayuda es un acto de valentía y autocuidado.
                    </p>
                </div>

                {/* Compartir */}
                <div className="my-12 py-8 border-t border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-6 font-medium">¿Te gustó este artículo? Compártelo:</p>
                    <ShareButtons title='La ansiedad: Cuándo es normal y cuándo buscar ayuda' />
                </div>

                {/* Comentarios */}
                <CommentsSection slug="la-ansiedad" />
            </article>
        </div>
    );
}
