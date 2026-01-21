
import Carousel from '@/components/Carousel'
import AboutMe from '@/components/AboutMe'
import TherapyServices from '@/components/TherapyServices'
import FAQ from '@/components/FAQ'
import BlogSection from '@/components/BlogSection'
import ContactForm from '@/components/ContactForm'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terapia Individual Online | Acompañamiento Psicológico y Coaching Emocional",
  description: "Terapia individual online con enfoque en coaching emocional, apoyo psicológico y manejo de emociones. Acompañamiento profesional para tu bienestar y crecimiento personal.",
  keywords: "terapia individual, terapia psicológica online, coaching emocional, acompañamiento psicológico, psicólogo, apoyo emocional, manejo de emociones, salud mental, psicólogo en línea, consulta psicológica",
  openGraph: {
    title: "Terapia Individual Online | Coaching Emocional",
    description: "Sesiones de terapia individual, acompañamiento psicológico y coaching emocional. Agenda tu cita hoy.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["MedicalBusiness", "LocalBusiness"],
  name: "Tu Psico Ana",
  description: "Terapia individual, coaching emocional y acompañamiento psicológico en línea",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com",
  image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/og-image.jpg`,
  areaServed: {
    "@type": "Place",
    name: "Latinoamérica"
  },
  serviceType: ["Terapia Individual", "Acompañamiento Psicológico", "Coaching Emocional", "Manejo de Emociones"],
  priceRange: "$$$",
  availableService: [
    {
      "@type": "Service",
      name: "Terapia Individual Online",
      description: "Sesiones de terapia individual personalizada con acompañamiento psicológico profesional"
    },
    {
      "@type": "Service",
      name: "Coaching Emocional",
      description: "Apoyo emocional y desarrollo personal a través del coaching psicológico"
    },
    {
      "@type": "Service",
      name: "Manejo de Emociones",
      description: "Técnicas y acompañamiento para identificar y manejar tus emociones de forma efectiva"
    }
  ]
};

const carouselImages = [
  {
    src: "/images/carrusel_1.jpg",
    alt: "Apoyo emocional y comprensión - Acompañamiento psicológico profesional",
    title: "Acompañamiento Emocional",
    description: "Un espacio seguro para expresar tus sentimientos y encontrar sanación"
  },
  {
    src: "/images/carrusel_2.jpg",
    alt: "Terapia psicológica y conexión - Tu psicólogo de confianza",
    title: "Conexión y Comprensión",
    description: "Te acompaño en tu proceso de terapia con empatía y profesionalismo",
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
          <h1 className="sr-only">Acompañamiento Psicológico Profesional - Terapia y Apoyo Emocional en Línea</h1>
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
          <h2 className="sr-only">Agendar Cita de Acompañamiento Psicológico</h2>
          <ContactForm showImage={true} variant="section" />
        </section>
      </main>
    </div>
  )
}
