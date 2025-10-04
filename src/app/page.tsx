
import Carousel from '@/components/Carousel'
import AboutMe from '@/components/AboutMe'
import TherapyServices from '@/components/TherapyServices'
import FAQ from '@/components/FAQ'

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
    description: "Te acompaño en tu proceso con empatía y profesionalismo",
    objectPosition: 70
  },
  {
    src: "/images/manejo-emociones.jpg",
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

        {/* Sección Sobre Mí */}
        <AboutMe />

        {/* Sección Terapias y Tratamientos */}
        <TherapyServices />

        {/* Sección Preguntas Frecuentes */}
        <FAQ />
      </main>
    </div>
  )
}
