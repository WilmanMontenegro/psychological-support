
import Carousel from '@/components/Carousel'
import AboutMe from '@/components/AboutMe'
import TherapyServices from '@/components/TherapyServices'
import FAQ from '@/components/FAQ'
import BlogSection from '@/components/BlogSection'
import ContactForm from '@/components/ContactForm'

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

        {/* Sección Blog */}
        <BlogSection />

        {/* Sección Contáctame */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8edf4] via-pastel-light to-tertiary-light">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,136,172,0.22),_transparent_55%)]" />
          <ContactForm showImage={true} variant="section" />
        </section>
      </main>
    </div>
  )
}
