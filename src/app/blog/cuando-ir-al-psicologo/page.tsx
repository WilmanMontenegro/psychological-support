import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import CommentsSection from '@/components/CommentsSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "¿Cuándo ir al psicólogo? Rompiendo mitos | Apoyo Psicológico",
    description: "Descubre por qué ir al psicólogo no es de 'locos', sino un acto de amor propio. Aprende a identificar las señales de que necesitas acompañamiento emocional.",
    keywords: "cuando ir al psicologo, mitos psicologia, apoyo emocional, salud mental, terapia psicologica, acompañamiento emocional, bienestar, cuidado personal",
    openGraph: {
        title: "¿Cuándo ir al psicólogo? Rompiendo mitos",
        description: "El acompañamiento psicológico es un acto de cuidado y respeto hacia ti mismo.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/acompanamiento-psicologico.jpeg`],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "¿Cuándo ir al psicólogo? Rompiendo mitos",
    description: "Artículo sobre la importancia del acompañamiento psicológico y cómo identificar cuándo pedir ayuda.",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/acompanamiento-psicologico.jpeg`,
    datePublished: "2026-02-05",
    author: {
        "@type": "Person",
        name: "Tu Psico Ana",
    },
    keywords: "psicologia, salud mental, acompañamiento, bienestar emocional",
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
                                5 de febrero, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTag style={{ color: 'var(--color-secondary)' }} />
                                Salud Mental
                            </span>
                        </div>

                        <SharePopover title="¿Cuándo ir al psicólogo? Rompiendo mitos" />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
                        ¿Cuándo ir al psicólogo? Rompiendo mitos
                    </h1>
                    <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
                </header>

                {/* Contenido */}
                <div className="prose prose-lg max-w-none text-justify">
                    <p className="text-gray-700 leading-relaxed mb-8">
                        El error más grande de muchas personas es pensar o creer que ir al psicólogo es solo para &quot;los locos&quot;, o no aceptar que necesitan ayuda. También están quienes solo van cuando ya no pueden más: cuando el dolor es evidente, cuando el cuerpo grita o cuando la tristeza es imposible de esconder.
                    </p>

                    {/* Imagen integrada en el texto */}
                    <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/images/blog/acompanamiento-psicologico.jpeg"
                            alt="Acompañamiento psicológico"
                            width={1200}
                            height={800}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Quiero recalcar que el acompañamiento psicológico no siempre llega en medio de una crisis; a veces llega —o lo necesitas— como un acto de cuidado, de escucha y de respeto hacia ti y hacia lo que sientes.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Es importante aclarar que el acompañamiento psicológico está pensado para ayudarte a transitar procesos difíciles, validar y cuidar tus emociones. El acompañamiento no da diagnósticos ni medicación; incluso el psicólogo especialista no medica. Muchas veces se confunde el acompañamiento psicológico con la terapia psicológica, y no son lo mismo: la terapia sí puede incluir diagnóstico.
                    </p>

                    <h3 className="text-2xl font-libre-baskerville text-accent mt-10 mb-6">
                        Señales que solemos pasar por alto
                    </h3>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Volviendo al punto, saber cuándo necesitamos acompañamiento tiene que ver con señales que suelen pasarse por alto. Por ejemplo, cuando te sientes cansada emocionalmente sin una razón clara; cuando todo te abruma más de lo normal; o cuando notas que reaccionas de maneras que antes no eran habituales en ti.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        También cuando te cuesta poner límites, cuando te exiges demasiado o cuando sientes que vas en automático: cumpliendo con todo, pero desconectada de ti.
                    </p>

                    <div className="bg-pastel-light p-6 rounded-xl border-l-4 border-secondary my-8">
                        <p className="text-gray-700 italic m-0">
                            &quot;No es que estés fallando. No es que haya algo mal en ti. Es que estás prestando atención. Tus emociones también merecen espacio, palabras y cuidado.&quot;
                        </p>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        A veces no necesitamos respuestas inmediatas; necesitamos un lugar seguro para ordenar lo que sentimos, sin juicios ni prisas. No es que &quot;tengas&quot; que ir a terapia. Es que te das permiso de hablar de ti, de tus miedos, de tus dudas y de tu historia. No es que tengas que cargar con todo sola.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8 font-semibold">
                        Y si alguna vez te preguntaste si lo necesitarías… tal vez ese &quot;algún día&quot; sea hoy.
                    </p>
                </div>

                <ShareButtons
                    title="¿Cuándo ir al psicólogo? Rompiendo mitos"
                />

                {/* Call to action */}
                <div className="mt-12 p-8 bg-pastel-light rounded-2xl text-center">
                    <h3 className="text-2xl font-libre-baskerville text-accent mb-4">
                        ¿Sientes que necesitas ese espacio seguro?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Estoy aquí para escucharte y acompañarte en tu proceso sin juicios.
                    </p>
                    <Link
                        href="https://tupsicoana.com/agendar-cita"
                        className="inline-block px-8 py-3 text-white rounded-lg font-medium transition hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-secondary)' }}
                    >
                        Agendar una consulta
                    </Link>
                </div>

                <div className="mt-8">
                    <CommentsSection slug="cuando-ir-al-psicologo" />
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
