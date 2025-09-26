"use client"

export default function AboutMe() {
  return (
    <section className="w-full py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Imagen */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src="/images/marcela.jpg"
                alt="Marcela Polo - Psicóloga"
                className="rounded-lg shadow-lg w-[26rem] h-auto"
              />
              <div className="absolute -bottom-8 -right-8 w-25 h-25 rounded-full opacity-20 bg-primary"></div>
            </div>
          </div>

          {/* Contenido de texto */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold font-libre-baskerville text-accent">
              Sobre Mí
            </h2>

            <div className="w-16 h-1 bg-secondary rounded-full"></div>

            <p className="text-lg font-lato leading-relaxed text-gray-700 text-justify">
              Soy Marcela Polo, psicóloga clínica con más de 8 años de experiencia ayudando a personas a superar sus desafíos emocionales y encontrar el bienestar que merecen. Mi enfoque se centra en crear un espacio seguro y libre de juicios donde puedas explorar tus pensamientos y emociones.
            </p>

            <p className="text-lg font-lato leading-relaxed text-gray-700 text-justify">
              Me especializo en terapia cognitivo-conductual, manejo de ansiedad y depresión, y procesos de duelo. Creo firmemente que cada persona tiene la capacidad de sanar y crecer, y mi rol es acompañarte en este proceso de autodescubrimiento y transformación personal.
            </p>

            <p className="text-lg font-lato leading-relaxed text-gray-700 text-justify">
              Mi misión es brindarte las herramientas necesarias para que puedas enfrentar los desafíos de la vida con mayor confianza y claridad. Juntos trabajaremos para construir una versión más fuerte y resiliente de ti mismo.
            </p>

            {/* Botón de contacto */}
            <div className="pt-4">
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