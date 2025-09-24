
import Carousel from '@/components/Carousel'

const carouselImages = [
  {
    src: "/images/carrusel_1.jpg",
    alt: "Apoyo emocional y comprensión",
    title: "Acompañamiento Emocional",
    description: "Un espacio seguro para expresar tus sentimientos y encontrar sanación"
  },
  {
    src: "/images/carrusel_2.jpg",
    alt: "Apoyo emocional y comprensión",
    title: "Conexión y Comprensión",
    description: "Te acompaño en tu proceso con empatía y profesionalismo"
  },
  {
    src: "/images/carrusel_3.jpg",
    alt: "Bienestar y crecimiento personal",
    title: "Crecimiento Personal",
    description: "Juntos trabajamos hacia tu bienestar y desarrollo emocional"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section con Carrusel */}
        <section className="w-full">
          <Carousel
            images={carouselImages}
            autoSlideInterval={6000}
            showDots={true}
            showArrows={true}
          />
        </section>

        {/* Contenido adicional */}
        <section className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-libre-baskerville font-bold mb-6" style={{ color: 'var(--color-primary)' }}>
              Bienvenido a tu espacio de bienestar
            </h1>
            <p className="text-lg font-lato text-gray-600 max-w-2xl mx-auto">
              Te acompaño en tu proceso de crecimiento personal y sanación emocional
              con un enfoque profesional, cálido y personalizado.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
