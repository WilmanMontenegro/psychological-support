import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-20">
      <ContactForm showImage={true} variant="page" />
    </div>
  );
}
