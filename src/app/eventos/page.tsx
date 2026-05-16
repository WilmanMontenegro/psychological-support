import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eventos | Tu Psico Ana',
  description:
    'Próximamente: talleres y encuentros educativos sobre bienestar emocional. Contenido formativo, sin atención clínica ni terapia.',
  keywords: 'eventos, bienestar emocional, talleres educativos, psicóloga en formación',
};

export default function EventosPage() {
  return (
    <div className="min-h-screen pt-20 pb-16 px-4 bg-pastel-light">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-libre-baskerville text-accent mb-4">
          Eventos
        </h1>
        <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-8" />

        <div className="bg-white rounded-2xl shadow-md border-2 border-secondary/20 px-8 py-12 md:py-14">
          <p className="text-2xl md:text-3xl font-libre-baskerville text-secondary mb-4">
            Muy pronto
          </p>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Estoy preparando talleres y encuentros con enfoque educativo sobre bienestar emocional.
            Aquí podrás ver las fechas y toda la información cuando estén listos.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Este espacio es solo formativo e informativo. No ofrece acompañamiento psicológico,
            terapia ni consultas clínicas.
          </p>
          <Link
            href="/blog"
            className="inline-block px-8 py-3 text-white rounded-lg font-medium transition hover:opacity-90"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            Mientras tanto, visita el blog
          </Link>
        </div>
      </div>
    </div>
  );
}
