import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pensamientos intrusivos: cuando tu mente te juega en contra | Tu Psico Ana',
    description: 'Los pensamientos intrusivos son más comunes de lo que crees. Aprende a identificarlos, entenderlos y dejarlos pasar sin juzgarte.',
    keywords: 'pensamientos intrusivos, salud mental, ansiedad, sobrepensar, bienestar emocional, terapia psicológica',
    openGraph: {
        type: 'article',
        title: 'Pensamientos intrusivos: cuando tu mente te juega en contra',
        description: 'Los pensamientos intrusivos son más comunes de lo que crees. Aprende a identificarlos, entenderlos y dejarlos pasar sin juzgarte.',
        images: [{
            url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/pensamientos-intrusivos.jpg`,
            width: 1200,
            height: 800,
            alt: 'Pensamientos intrusivos',
        }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pensamientos intrusivos: cuando tu mente te juega en contra',
        description: 'Los pensamientos intrusivos son más comunes de lo que crees. Aprende a identificarlos, entenderlos y dejarlos pasar sin juzgarte.',
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/pensamientos-intrusivos.jpg`],
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Pensamientos intrusivos: cuando tu mente te juega en contra',
    description: 'Los pensamientos intrusivos son más comunes de lo que crees. Aprende a identificarlos, entenderlos y dejarlos pasar sin juzgarte.',
    image: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://tupsicoana.com'}/images/blog/pensamientos-intrusivos.jpg`,
    datePublished: '2026-04-23',
    author: {
        '@type': 'Person',
        name: 'Tu Psico Ana',
    },
    keywords: 'pensamientos intrusivos, salud mental, ansiedad, bienestar emocional',
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
                                23 de abril, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTag style={{ color: 'var(--color-secondary)' }} />
                                Salud Mental
                            </span>
                        </div>

                        <SharePopover title='Pensamientos intrusivos: cuando tu mente te juega en contra' />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
                        Pensamientos intrusivos: cuando tu mente te juega en contra
                    </h1>
                    <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
                </header>

                {/* Contenido */}
                <div className="prose prose-lg max-w-none text-justify">
                    <p className="text-gray-700 leading-relaxed mb-8">
                        Hoy quiero hablar de algo que muchas personas han vivido, pero que casi no se menciona: <strong>los pensamientos intrusivos</strong>. Son esos pensamientos que surgen de la nada, sin que los invites, y que a menudo te hacen sentir incómoda, confundida o incluso culpable.
                    </p>

                    {/* Imagen integrada en el texto */}
                    <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/images/blog/pensamientos-intrusivos.jpg"
                            alt="Pensamientos intrusivos"
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Son ideas que llegan de repente y te preguntas: <em>&ldquo;&iquest;por qu&eacute; pens&eacute; eso?&rdquo;</em>. Son pensamientos que no son parte de ti, que no reflejan qui&eacute;n eres, pero a&uacute;n as&iacute; aparecen y se repiten en tu mente.
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        No estás sola en esto
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Lo primero que quiero que sepas es esto: <strong>tener pensamientos intrusivos es más común de lo que crees</strong>. No significa que quieras hacer lo que pensaste. No significa que seas una mala persona. No significa que haya algo mal en ti. Solo indica que tu mente está generando contenido, y no siempre refleja quién eres realmente.
                    </p>

                    <div className="clear-both"></div>

                    <div className="p-6 bg-secondary/5 rounded-xl border-l-4 border-secondary my-8">
                        <p className="text-gray-800 font-semibold">
                            💭 Tener pensamientos intrusivos no te define. No significa que seas una mala persona ni que haya algo mal en ti.
                        </p>
                    </div>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        El problema no es el pensamiento, es la reacción
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        El problema no es el pensamiento en sí, sino <strong>cómo reaccionamos a él</strong>. Cuando intentamos bloquearlo, luchar contra él o eliminarlo, a menudo se vuelve más fuerte. Ahí es cuando empezamos a sobrepensar, a cuestionarnos y a sentir ansiedad.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        También es común asustarse porque no entendemos de dónde vienen estos pensamientos. La mente funciona así: crea escenarios, mezcla ideas, exagera, recuerda cosas, imagina otras… y a veces surgen pensamientos que simplemente no tienen sentido.
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        No todo lo que piensas eres tú
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Lo importante aquí es aprender a <strong>no identificarnos con ellos</strong>. No todo lo que piensas eres tú. Un pensamiento no te define. No te convierte en algo. No te hace buena o mala persona. Es solo eso: un pensamiento.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Cuando comienzas a entender esto, cambia la forma en que los enfrentas. En lugar de asustarte o juzgarte, puedes observarlos y dejarlos pasar, sin darles tanto poder. No se trata de controlar todo, sino de aprender a relacionarte de manera diferente con tu mente.
                    </p>

                    <div className="p-6 bg-green-50 rounded-xl border-l-4 border-green-500 my-8">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">✨ Recuerda</h3>
                        <p className="text-gray-700">
                            No todo lo que piensas eres tú. Un pensamiento es solo un pensamiento. Puedes observarlo sin juzgarlo y dejarlo pasar sin darle más poder del que merece.
                        </p>
                    </div>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-8 mb-4">
                        Un mensaje final
                    </h2>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Y si alguna vez te ha pasado, quiero que te quedes con esto: <strong>no estás sola</strong>. A muchas personas les ocurre, solo que no lo dicen. Es parte de la experiencia humana, y aprender a convivir con ello es un acto de valentía y autocuidado.
                    </p>
                </div>

                {/* Compartir */}
                <div className="my-12 py-8 border-t border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-6 font-medium">¿Te gustó este artículo? Compártelo:</p>
                    <ShareButtons title='Pensamientos intrusivos: cuando tu mente te juega en contra' />
                </div>

                {/* Comentarios */}
                <CommentsSection slug="pensamientos-intrusivos" />
            </article>
        </div>
    );
}
