"use client"

import Link from 'next/link'

export default function WhyChooseMe() {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Enfoque Humano",
      description: "Comparto contenido con sensibilidad, cercanía y respeto por cada proceso emocional, desde una mirada psicosocial y de aprendizaje continuo."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Contenido Accesible",
      description: "El objetivo del sitio es ofrecer recursos claros y cercanos para fortalecer el bienestar emocional y el crecimiento personal."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Comunidad y Conversación",
      description: "El blog y los comentarios son espacios para compartir reflexiones, aprendizajes y herramientas prácticas con una comunidad respetuosa."
    }
  ]

  return (
    <section className="w-full py-16 px-6 bg-tertiary-light">
      <div className="max-w-6xl mx-auto">
        {/* Título */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent">
            ¿Por Qué Elegirme?
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mt-4 mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Un espacio cercano de marca personal, aprendizaje emocional y conversación consciente
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-all duration-300 text-center group border border-gray-100"
            >
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-300"
                style={{ backgroundColor: 'var(--color-pastel)' }}
              >
                <div style={{ color: 'var(--color-secondary)' }} className="group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold font-libre-baskerville text-accent mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
            Gracias por hacer parte de esta comunidad. Aquí encontrarás contenido, reflexiones y recursos para seguir creciendo.
          </p>
          <Link
            href="/blog"
            className="inline-block text-white px-8 py-3 rounded-lg font-montserrat font-medium text-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            Ver blog
          </Link>
        </div>
      </div>
    </section>
  )
}