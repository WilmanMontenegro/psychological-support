import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaTag } from 'react-icons/fa';

export default function BlogPost() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4">
      <article className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-secondary hover:underline mb-8">
          <FaArrowLeft /> Volver al blog
        </Link>

        {/* Encabezado */}
        <header className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span className="flex items-center gap-2">
              <FaCalendar style={{ color: 'var(--color-secondary)' }} />
              7 de octubre, 2025
            </span>
            <span className="flex items-center gap-2">
              <FaTag style={{ color: 'var(--color-secondary)' }} />
              Bienestar
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-libre-baskerville text-accent mb-6">
            Aprendamos a identificar y sobre todo a manejar nuestras emociones
          </h1>
          <div className="w-24 h-1 bg-secondary rounded-full mb-8"></div>
        </header>

        {/* Contenido */}
        <div className="prose prose-lg max-w-none text-justify">
          <p className="text-gray-700 leading-relaxed mb-8">
            Cuando pensamos que manejar nuestras emociones significa mantenerlas ocultas, que nadie sepa cómo te sientes, o cuando te haces el fuerte cuando estás triste, eso se llama fingir que no existen o simplemente deshacernos de ellas. Saber manejar las emociones no se trata de ignorarlas, sino de reconocerlas, saber cómo te sientes y vivir con ellas de tal manera que sepas controlarlas.
          </p>

          {/* Imagen integrada en el texto */}
          <div className="float-right ml-6 mb-6 w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="/images/blog/aprendamos-a-identificar-y-manejar-nuestras-emociones/portada.jpg"
              alt="Manejo de emociones"
              className="w-full h-auto"
            />
          </div>

          <p className="text-gray-700 leading-relaxed mb-8">
            Cada una de nuestras emociones nos da un mensaje del que debemos aprender. Por ejemplo, la tristeza puede revelar una pérdida que hemos ignorado, la ira o la rabia muestra que hemos sobrepasado un límite y el miedo nos alerta de aquellas cosas o situaciones en dónde debemos cuidarnos. Cuando dejamos de juzgar nuestras emociones y comenzamos a escucharlas con responsabilidad, podemos empezar a crear espacio para nuestro propio crecimiento emocional.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            El primer paso es encontrarle un nombre a tu emoción o sentimiento. Hablar con alguien de confianza sobre que te sientes estresado o totalmente agotado ayuda a esa persona a comprender lo que estás pasando. A veces solo necesitas un respiro, otras veces es bueno tener a alguien cerca o mantener las cosas bajo control.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            También recordemos que todas nuestras emociones tienen un propósito. Sin ellas no podemos avanzar hasta donde estamos, no sólo son buenas o malas. La clave es cómo las manejamos y qué hacemos con ellas. Aprender a sentirlas sin juzgarlas es una forma de autocuidado profundo. Es un pequeño empujón que nos recuerda que está bien sentir, cometer un error y darle otra oportunidad.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8 font-semibold">
            Recuerden que saber manejar las emociones nos da crecimiento personal y mental. Anímate para que aprendas a manejar esas emociones que te cuestan identificar.
          </p>
        </div>

        {/* Call to action */}
        <div className="mt-12 p-8 bg-pastel-light rounded-2xl text-center">
          <h3 className="text-2xl font-libre-baskerville text-accent mb-4">
            ¿Necesitas apoyo para manejar tus emociones?
          </h3>
          <p className="text-gray-600 mb-6">
            Estoy aquí para acompañarte en tu proceso de crecimiento emocional
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
