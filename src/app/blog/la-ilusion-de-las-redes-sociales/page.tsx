import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'La ilusión de las redes sociales | Apoyo Psicológico',
    description: 'Aprende a usar las redes sociales de manera consciente y evita compararte con vidas que parecen perfectas. Tu valor no depende de una pantalla.',
    keywords: 'redes sociales, comparación, ansiedad, estrés, salud mental, uso consciente, bienestar emocional',
    openGraph: {
        title: 'La ilusión de las redes sociales',
        description: 'Aprende a usar las redes sociales de manera consciente y evita compararte con vidas que parecen perfectas.',
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/la-ilusion-de-las-redes-sociales.jpg`],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'La ilusión de las redes sociales',
    description: 'Aprende a usar las redes sociales de manera consciente y evita compararte con vidas que parecen perfectas.',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/la-ilusion-de-las-redes-sociales.jpg`,
    datePublished: '2026-02-19',
    author: {
        '@type': 'Person',
        name: 'Tu Psico Ana',
    },
    keywords: 'redes sociales, comparación, ansiedad, estrés, salud mental',
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
                                19 de febrero, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTag style={{ color: 'var(--color-secondary)' }} />
                                Salud Mental
                            </span>
                        </div>

                        <SharePopover title='La ilusión de las redes sociales' />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
                        La ilusión de las redes sociales
                    </h1>
                    <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
                </header>

                {/* Contenido */}
                <div className="prose prose-lg max-w-none text-justify">
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Las redes sociales son como una ventana abierta donde vemos la vida de los demás. Vemos personas con cuerpos perfectos, que hacen muchas cosas, viajan, tienen relaciones estables y siempre parecen felices. Aunque sabemos que no todo es real, nos comparamos con lo que vemos en la pantalla.
                    </p>

                    {/* Imagen integrada en el texto */}
                    <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/images/blog/la-ilusion-de-las-redes-sociales.jpg"
                            alt="Personas conectadas a sus redes sociales"
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        El problema no son las redes sociales, sino cómo las usamos. Cuando nos comparamos con vidas que parecen perfectas, sentimos presión. Empezamos a pensar que no somos suficientes, que deberíamos hacer más, que nuestra vida no es interesante. Entonces sentimos ansiedad y estrés porque creemos que no estamos a la altura.
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        Lo que no ves detrás de la pantalla
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Olvidamos que detrás de cada foto o historia hay una historia completa que no se muestra. No vemos los días malos, los errores, los miedos. Solo vemos lo bueno y lo usamos para juzgarnos. Esto hace que nos sintamos mal con nosotros mismos y que nos olvidemos de nuestra propia vida.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Cuando pasamos mucho tiempo mirando lo que otros hacen, empezamos a vivir pendientes de ellos en lugar de pensar en lo que necesitamos. Queremos ser como personas que no conocemos y olvidamos que cada persona es diferente y que todos vivimos a nuestro propio ritmo. La vida no es como una historia corta en las redes sociales.
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        Uso consciente de las redes sociales
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Usar las redes sociales de manera consciente significa recordar que lo que vemos no es la verdad completa. Significa poner límites, preguntarnos si lo que vemos es real y cuidar nuestra salud mental. No todo lo que vemos en las redes sociales es verdad y nuestro valor no depende de compararnos con otros.
                    </p>

                    <div className="p-6 bg-secondary/5 rounded-xl border-l-4 border-secondary my-8">
                        <p className="text-gray-800 font-semibold">
                            💭 Recuerda: Tu valor no se mide en likes ni en comparaciones con vidas ajenas. Aprende a disfrutar de tu propio ritmo y poner a salvo tu paz mental.
                        </p>
                    </div>
                </div>

                {/* Compartir */}
                <div className="my-12 py-8 border-t border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-6 font-medium">¿Te gustó este artículo? Compártelo:</p>
                    <ShareButtons title='La ilusión de las redes sociales' />
                </div>

                {/* Comentarios */}
                <CommentsSection slug="la-ilusion-de-las-redes-sociales" />
            </article>
        </div>
    );
}
