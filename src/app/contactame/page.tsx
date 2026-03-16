import ContactForm from '@/components/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contacto y colaboraciones | Ana Marcela Polo Bastidas",
  description: "Canal de contacto para consultas generales, colaboraciones y contenido de marca personal.",
  keywords: "contacto, marca personal, colaboraciones, bienestar emocional",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contacto de marca personal",
  description: "Canal de contacto para información y colaboraciones",
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
      <h1 className="sr-only">Página de contacto y colaboraciones</h1>
      <ContactForm showImage={true} variant="page" />
    </div>
  );
}
