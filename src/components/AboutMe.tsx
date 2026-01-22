"use client"

import Image from 'next/image'
import Link from 'next/link'

interface AboutMeProps {
  showButton?: boolean
  bgColor?: string
}

export default function AboutMe({ showButton = true, bgColor = 'bg-white' }: AboutMeProps) {
  // Usar colores que contrasten según el fondo
  const isLightBg = bgColor.includes('pastel-light') || bgColor.includes('tertiary-light')

  return (
    <section className={`w-full py-16 px-6 ${bgColor} relative overflow-hidden`}>
      {/* Bolitas decorativas de fondo - Detrás del contenido (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Zona superior - más dispersas */}
        <div className={`absolute top-8 left-12 w-20 h-20 rounded-full ${isLightBg ? 'opacity-35 bg-secondary' : 'opacity-20 bg-primary'}`}></div>
        <div className={`absolute top-24 right-20 w-16 h-16 rounded-full ${isLightBg ? 'opacity-30 bg-tertiary' : 'opacity-25 bg-pastel'}`}></div>
        <div className={`absolute top-40 left-[15%] w-14 h-14 rounded-full ${isLightBg ? 'opacity-28 bg-accent' : 'opacity-18 bg-secondary'}`}></div>
        <div className={`absolute top-16 right-[35%] w-10 h-10 rounded-full ${isLightBg ? 'opacity-25 bg-tertiary' : 'opacity-20 bg-pastel'}`}></div>

        {/* Zona lateral derecha - en los extremos */}
        <div className={`absolute top-[45%] right-8 w-18 h-18 rounded-full ${isLightBg ? 'opacity-28 bg-tertiary' : 'opacity-18 bg-pastel'}`}></div>
        <div className={`absolute top-[65%] right-24 w-12 h-12 rounded-full ${isLightBg ? 'opacity-30 bg-accent' : 'opacity-20 bg-secondary'}`}></div>

        {/* Zona lateral izquierda - en los extremos */}
        <div className={`absolute top-[55%] left-6 w-16 h-16 rounded-full ${isLightBg ? 'opacity-25 bg-secondary' : 'opacity-20 bg-primary'}`}></div>

        {/* Zona inferior - dispersas */}
        <div className={`absolute bottom-24 right-[28%] w-24 h-24 rounded-full ${isLightBg ? 'opacity-25 bg-accent' : 'opacity-15 bg-secondary'}`}></div>
        <div className={`absolute bottom-20 left-20 w-14 h-14 rounded-full ${isLightBg ? 'opacity-30 bg-secondary' : 'opacity-20 bg-primary'}`}></div>
        <div className={`absolute bottom-36 right-16 w-12 h-12 rounded-full ${isLightBg ? 'opacity-28 bg-tertiary' : 'opacity-22 bg-pastel'}`}></div>
      </div>

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
              <Image
                src="/images/ana_1.png"
                alt="Ana Marcela Polo Bastidas - Psicóloga"
                width={416}
                height={520}
                className="rounded-lg shadow-lg w-[26rem] h-auto"
                sizes="(max-width: 768px) 100vw, 26rem"
                priority
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
            {showButton && (
              <div className="pt-4 text-center">
                <Link
                  href="/sobre-mi"
                  className="inline-block text-white px-8 py-3 rounded-lg font-montserrat font-medium text-lg hover:opacity-90 transition-all duration-300 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: 'var(--color-secondary)' }}
                >
                  Conoce más sobre mi enfoque
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
