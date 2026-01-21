import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Agendar Terapia Individual Online | Coaching Emocional",
  description: "Agenda tu sesión de terapia individual, coaching emocional y acompañamiento psicológico. Contacta hoy para comenzar tu acompañamiento en línea.",
  keywords: "agendar cita psicólogo, terapia individual online, coaching emocional, consulta psicológica, acompañamiento psicológico",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Agendar Cita de Acompañamiento Psicológico",
  description: "Solicita tu cita de terapia y apoyo psicológico profesional",
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
