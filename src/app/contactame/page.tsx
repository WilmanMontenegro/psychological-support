import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8edf4] via-pastel-light to-tertiary-light pt-6 md:pt-10">
      <ContactForm showImage={true} variant="page" />
    </div>
  );
}
