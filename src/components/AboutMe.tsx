"use client"

export default function AboutMe() {
  return (
    <section className="w-full py-16 px-6 bg-white relative overflow-hidden">
      {/* Bolitas decorativas de fondo - Bien distribuidas */}
      <div className="absolute top-10 left-10 w-16 h-16 rounded-full opacity-30 bg-primary"></div>
      <div className="absolute top-20 right-16 w-12 h-12 rounded-full opacity-40 bg-pastel"></div>
      <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full opacity-50 bg-secondary"></div>
      <div className="absolute top-1/2 right-10 w-20 h-20 rounded-full opacity-20 bg-primary"></div>
      <div className="absolute top-2/3 left-1/3 w-10 h-10 rounded-full opacity-45 bg-pastel"></div>
      <div className="absolute bottom-20 right-1/4 w-14 h-14 rounded-full opacity-35 bg-secondary"></div>
      <div className="absolute bottom-16 left-16 w-12 h-12 rounded-full opacity-40 bg-primary"></div>
      <div className="absolute top-1/4 right-1/3 w-10 h-10 rounded-full opacity-50 bg-pastel"></div>
      <div className="absolute bottom-32 left-1/2 w-8 h-8 rounded-full opacity-45 bg-secondary"></div>

      {/* Bolitas adicionales para mayor distribución */}
      <div className="absolute top-16 left-1/2 w-6 h-6 rounded-full opacity-55 bg-primary"></div>
      <div className="absolute top-1/2 left-10 w-14 h-14 rounded-full opacity-25 bg-pastel"></div>
      <div className="absolute top-3/4 right-20 w-12 h-12 rounded-full opacity-40 bg-secondary"></div>
      <div className="absolute bottom-10 left-1/4 w-10 h-10 rounded-full opacity-50 bg-primary"></div>
      <div className="absolute top-2/5 left-3/4 w-8 h-8 rounded-full opacity-45 bg-pastel"></div>
      <div className="absolute bottom-1/3 right-1/2 w-16 h-16 rounded-full opacity-30 bg-secondary"></div>
      <div className="absolute top-5/6 left-1/6 w-6 h-6 rounded-full opacity-60 bg-primary"></div>

      {/* Más bolitas para el lado derecho - Mejor distribuidas */}
      <div className="absolute top-1/5 left-3/5 w-10 h-10 rounded-full opacity-45 bg-pastel"></div>
      <div className="absolute top-2/5 left-4/5 w-12 h-12 rounded-full opacity-35 bg-secondary"></div>
      <div className="absolute top-4/5 left-2/3 w-8 h-8 rounded-full opacity-50 bg-primary"></div>
      <div className="absolute bottom-1/4 left-5/6 w-14 h-14 rounded-full opacity-30 bg-pastel"></div>
      <div className="absolute top-3/5 left-3/4 w-6 h-6 rounded-full opacity-55 bg-secondary"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:grid md:grid-cols-2 gap-8 items-center">
          {/* Título - móvil first */}
          <div className="order-1 md:order-1 md:col-span-2 md:hidden">
            <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent text-center">
              Sobre Mí
            </h2>
            <div className="w-16 h-1 bg-secondary rounded-full mx-auto mt-4"></div>
          </div>

          {/* Imagen - móvil second */}
          <div className="flex justify-center order-2 md:order-2">
            <div className="relative">
              <img
                src="/images/marcela.jpg"
                alt="Marcela Polo - Psicóloga"
                className="rounded-lg shadow-lg w-[26rem] h-auto"
              />
              <div className="absolute -bottom-8 -right-8 w-25 h-25 rounded-full opacity-20 bg-primary"></div>
            </div>
          </div>

          {/* Contenido de texto - móvil third */}
          <div className="space-y-6 order-3 md:order-1">
            {/* Título desktop only */}
            <div className="hidden md:block">
              <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent">
                Sobre Mí
              </h2>
              <div className="w-16 h-1 bg-secondary rounded-full mt-4"></div>
            </div>

            <p className="text-lg font-lato leading-relaxed text-gray-700 text-justify">
              Soy Ana Marcela Polo Bastidas, estudiante de Psicología en etapa final de formación. Mi camino académico y práctico me ha permitido acercarme a diferentes enfoques, y actualmente me centro en una perspectiva psicosocial, donde comprendo al ser humano no solo desde lo individual, sino también desde sus vínculos, su entorno y su comunidad.
            </p>

            <p className="text-lg font-lato leading-relaxed text-gray-700 text-justify">
              Mi propósito es acompañar a las personas en sus procesos de autoconocimiento, fortalecimiento emocional y desarrollo personal, brindando un espacio seguro, cercano y sin juicios, donde puedan expresarse libremente y encontrar recursos internos y externos para afrontar los retos de la vida.
            </p>

            <p className="text-lg font-lato leading-relaxed text-gray-700 text-justify">
              Creo en el poder de la empatía, el acompañamiento y el apoyo mutuo como claves para el bienestar y la transformación personal y social.
            </p>

            {/* Botón de contacto */}
            <div className="pt-4 text-center">
              <button
                className="text-white px-8 py-3 rounded-lg font-montserrat font-medium text-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                Conoce más sobre mi enfoque
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}