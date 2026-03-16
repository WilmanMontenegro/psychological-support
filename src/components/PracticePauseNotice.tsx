import Link from 'next/link'

interface PracticePauseNoticeProps {
  title?: string
}

export default function PracticePauseNotice({
  title = 'Atención: servicios clínicos en pausa temporal'
}: PracticePauseNoticeProps) {
  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md border border-secondary/15 p-8 md:p-10 text-center">
        <h1 className="text-2xl md:text-3xl font-libre-baskerville text-accent mb-4">
          {title}
        </h1>
        <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6" />

        <p className="text-gray-700 leading-relaxed mb-4">
          Ana Marcela se encuentra actualmente como <strong>psicóloga en formación</strong>, por lo que
          la funcionalidad de agendamiento de citas y acompañamiento psicológico está temporalmente pausada.
        </p>

        <p className="text-gray-700 leading-relaxed mb-8">
          El sitio sigue activo como espacio de marca personal y contenido educativo en el blog.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/blog"
            className="inline-block text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            Ir al Blog
          </Link>
          <Link
            href="/sobre-mi"
            className="inline-block px-6 py-3 rounded-lg font-medium border transition hover:bg-gray-50"
            style={{ color: 'var(--color-secondary)', borderColor: 'var(--color-secondary)' }}
          >
            Conocer el perfil
          </Link>
        </div>
      </div>
    </div>
  )
}
