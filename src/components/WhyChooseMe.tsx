"use client"

export default function WhyChooseMe() {
  const features = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "Me Gusta Ayudar",
      description: "Mi mayor satisfacción es acompañarte en tu proceso de sanación y crecimiento personal. Cada sesión es un espacio dedicado a ti y tu bienestar."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Consultas Accesibles",
      description: "Las sesiones funcionan con donaciones voluntarias. Tú decides cuánto aportar según tus posibilidades y el valor que el acompañamiento tuvo para ti."
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Trabajo Conjunto",
      description: "Te escucho con atención y empatía. Juntos exploramos tus emociones y buscamos soluciones adaptadas a tu situación única."
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
            Un espacio seguro y accesible donde encontrarás apoyo genuino para tu bienestar emocional
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
            Mi compromiso es brindarte un espacio donde te sientas escuchado, comprendido y apoyado en tu camino hacia el bienestar emocional.
          </p>
          <a
            href="/agendar-cita"
            className="inline-block text-white px-8 py-3 rounded-lg font-montserrat font-medium text-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            Agenda tu Primera Consulta
          </a>
        </div>
      </div>
    </section>
  )
}