import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa6';
import ShareButtons from '@/components/ShareButtons';
import SharePopover from '@/components/SharePopover';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "El cuido emocional en el postparto de una mujer que nadie mira | Apoyo Psicológico",
    description: "El postparto es una etapa emocional compleja. Descubre cómo manejar las emociones, la soledad y el autocuidado mientras nace una nueva madre.",
    keywords: "postparto, salud emocional, maternidad, depresion postparto, autocuidado, apoyo emocional",
    openGraph: {
        title: "El cuido emocional en el postparto de una mujer que nadie mira",
        description: "Consejos para cuidar de ti misma mientras cuidas de tu bebé. No estás sola en este proceso.",
        images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/cuido-emocional-postparto/post-parto.jpeg`],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "El cuido emocional en el postparto de una mujer que nadie mira",
    description: "Guía de apoyo emocional para madres en postparto: validación de emociones, consejos de autocuidado y la importancia de pedir ayuda.",
    image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/blog/cuido-emocional-postparto/post-parto.jpeg`,
    datePublished: "2026-01-29",
    author: {
        "@type": "Person",
        name: "Tu Psico Ana",
    },
    keywords: "postparto, maternidad, salud mental, autocuidado, emociones",
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
                                29 de enero, 2026
                            </span>
                            <span className="flex items-center gap-2">
                                <FaTag style={{ color: 'var(--color-secondary)' }} />
                                Maternidad
                            </span>
                        </div>

                        <SharePopover title="El cuido emocional en el postparto de una mujer que nadie mira" />
                    </div>

                    <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6 leading-tight">
                        El cuido emocional en el postparto de una mujer que nadie mira
                    </h1>
                    <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
                </header>

                {/* Contenido */}
                <div className="prose prose-lg max-w-none text-justify">
                    <p className="text-gray-700 leading-relaxed mb-8 font-medium">
                        El postparto es un tema muy complejo del que todos deberíamos hablar, y de cómo se vive este proceso en nuestra salud emocional y personal.
                    </p>

                    <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src="/images/blog/cuido-emocional-postparto/post-parto.jpeg"
                            alt="Madre y bebé en momento de conexión"
                            width={800}
                            height={600}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Cuando entramos en el postparto, las llamadas hormonas de la felicidad entran en una montaña rusa inmensa: la dopamina, la oxitocina, la serotonina y las endorfinas. Estas son producidas por el cuerpo para regular el estado de ánimo, el placer y la motivación; sin embargo, suelen disminuir durante esta etapa.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Por eso, cuando nace un hijo, también nace una nueva madre, pero mientras todos miran al bebé, <strong>muy pocos se preocupan por la madre</strong>. Después del parto, el cuerpo de una mujer está en plena reconstrucción; el útero tarda alrededor de seis semanas en regresar a su tamaño normal. Entonces, absolutamente todo impacta profundamente su estado físico y emocional.
                    </p>

                    <p className="text-gray-700 leading-relaxed mb-8">
                        Por eso, a ti que estás en este proceso del postparto y no has sabido cómo manejarlo; a ti que sientes que todo pasa por tu cuerpo, por emociones que no sabes qué son ni por qué las sientes; a ti que sientes que tu pareja se aleja y que estás sola en este proceso tan difícil; a ti que vives la falta de sueño por cuidar a tu bebé…
                    </p>

                    <h2 className="text-2xl font-libre-baskerville text-accent mt-12 mb-6">
                        Consejos para transitar el postparto
                    </h2>

                    <ul className="space-y-6 mb-12">
                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-secondary"></div>
                            <div>
                                <strong className="block text-lg text-gray-900 mb-1">Pide ayuda cuando sientas que lo necesitas</strong>
                                <span className="text-gray-700">Vivir sola este proceso no te hace sentir mejor, y no tienes por qué hacerlo.</span>
                            </div>
                        </li>

                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-secondary"></div>
                            <div>
                                <strong className="block text-lg text-gray-900 mb-1">Puedes salir de tu casa</strong>
                                <span className="text-gray-700">Dar un paseo, visitar a tus amigas… salir de tu casa como lo hacías antes de ser madre, seguir siendo tú. Estas salidas pueden ayudarte muchísimo.</span>
                            </div>
                        </li>

                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-secondary"></div>
                            <div>
                                <strong className="block text-lg text-gray-900 mb-1">Busca la manera de darte un espacio para ti</strong>
                                <span className="text-gray-700">No pasa nada si inviertes en ti, en ir más despacio. Es normal no querer recibir tantas visitas; solo prioriza tu descanso. Aliméntate bien durante este proceso.</span>
                            </div>
                        </li>

                        <li className="flex gap-4">
                            <div className="flex-shrink-0 w-2 h-2 mt-2.5 rounded-full bg-secondary"></div>
                            <div>
                                <strong className="block text-lg text-gray-900 mb-1">Conecta con lo que te gusta</strong>
                                <span className="text-gray-700">Escucha música; esto puede ayudarte, ya que el poder de la música puede reconstruirte. Baila, haz lo que te gustaba antes de ser mamá.</span>
                            </div>
                        </li>
                    </ul>

                    <div className="bg-white p-8 rounded-2xl border-l-4 border-secondary shadow-sm my-12">
                        <p className="text-lg text-gray-800 italic relative">
                            <span className="text-6xl text-gray-200 absolute -top-8 -left-4 font-serif">“</span>
                            Y aquí quiero decirte algo importante, desde lo más humano: <strong>no tienes que sentirte agradecida todo el tiempo, ni feliz todos los días</strong>. Estás aprendiendo a ser madre mientras sigues siendo mujer. Ambas cosas pueden convivir, incluso en medio del cansancio, la confusión y las lágrimas. Este proceso no define qué tan buena madre eres; solo muestra que estás viviendo algo profundo y real.
                        </p>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-4 text-center text-xl">
                        Si hoy te sientes cansada, está bien.<br />
                        Si hoy necesitas hablar, también está bien.<br />
                        <strong>No estás sola.</strong>
                    </p>
                </div>

                <ShareButtons
                    title="El cuido emocional en el postparto de una mujer que nadie mira"
                />

                {/* Call to action */}
                <div className="mt-12 p-8 bg-pastel-light rounded-2xl text-center">
                    <h3 className="text-2xl font-libre-baskerville text-accent mb-4">
                        ¿Necesitas alguien que te acompañe?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        El postparto es un camino que no tienes que recorrer en soledad. Estoy aquí para escucharte y darte herramientas.
                    </p>
                    <Link
                        href="/agendar-cita"
                        className="inline-block px-8 py-3 text-white rounded-lg font-medium transition hover:opacity-90"
                        style={{ backgroundColor: 'var(--color-secondary)' }}
                    >
                        Agendar una consulta
                    </Link>
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
