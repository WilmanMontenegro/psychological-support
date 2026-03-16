
import Carousel from '@/components/Carousel'
import AboutMe from '@/components/AboutMe'
import BlogSection from '@/components/BlogSection'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ana Marcela Polo Bastidas | Psicóloga en formación",
  description: "Sitio personal de Ana Marcela Polo Bastidas, psicóloga en formación. Contenido educativo, reflexiones y blog sobre bienestar emocional y crecimiento personal.",
  keywords: "psicóloga en formación, marca personal, bienestar emocional, blog, crecimiento personal",
  openGraph: {
    title: "Ana Marcela Polo Bastidas | Psicóloga en formación",
    description: "Marca personal y contenido educativo sobre bienestar emocional y crecimiento personal.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Tu Psico Ana",
  description: "Marca personal y blog de bienestar emocional",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com",
  image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/images/logo-grande-1000x1000.png`,
  jobTitle: "Psicóloga en formación"
};

const carouselImages = [
  {
    src: "/images/carrusel_1.jpg",
    alt: "Bienestar emocional y reflexión personal",
    title: "Bienestar Emocional",
    description: "Un espacio para reflexionar, aprender y crecer"
  },
  {
    src: "/images/carrusel_2.jpg",
    alt: "Conexión y crecimiento personal",
    title: "Conexión y Comprensión",
    description: "Contenido cercano para fortalecer tu desarrollo personal",
    objectPosition: 70
  },
  {
    src: "/images/manejo-emociones.jpg",
    alt: "Bienestar y crecimiento personal - Manejo de emociones",
    title: "Crecimiento Personal",
    description: "Juntos trabajamos hacia tu bienestar emocional y desarrollo integral"
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Hero Section con Carrusel */}
        <section className="w-full">
          <h1 className="sr-only">Ana Marcela Polo Bastidas, psicóloga en formación</h1>
          <Carousel
            images={carouselImages}
            autoSlideInterval={6000}
            showDots={true}
            showArrows={true}
          />
        </section>

        {/* Sección Sobre Mí */}
        <AboutMe />

        {/* Sección Blog */}
        <BlogSection />

        {/* Sección Contáctame */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8edf4] via-pastel-light to-tertiary-light">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(191,136,172,0.22),_transparent_55%)]" />
          <h2 className="sr-only">Contacto y colaboraciones</h2>
          <ContactForm showImage={true} variant="section" />
        </section>
      </main>
    </div>
  )
}
