import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agendar Sesión de Acompañamiento Psicológico Online | Coaching Emocional",
  description: "Agenda tu sesión de acompañamiento psicológico, coaching emocional y apoyo emocional. Contacta hoy para comenzar tu proceso de crecimiento en línea.",
  keywords: "agendar cita psicólogo, acompañamiento psicológico online, coaching emocional, consulta psicológica, apoyo emocional",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Agendar Cita de Acompañamiento Psicológico",
  description: "Solicita tu cita de acompañamiento y apoyo psicológico profesional",
  url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://tupsicoana.com"}/contactame`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8edf4] via-pastel-light to-tertiary-light pt-6 md:pt-10">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Agendar Cita de Acompañamiento Psicológico</h1>
      <ContactForm showImage={true} variant="page" />
    </div>
  );
}
