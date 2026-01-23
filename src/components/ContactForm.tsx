'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ContactFormProps {
  showImage?: boolean;
  variant?: 'section' | 'page';
}

export default function ContactForm({ showImage = true, variant = 'section' }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;

    // Solo permitir números en el campo de teléfono
    if (e.target.name === 'phone') {
      value = value.replace(/[^0-9+\-\s]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al enviar el mensaje');

      toast.success('¡Mensaje enviado! Te contactaré pronto');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch {
      toast.error('Error al enviar el mensaje. Intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  const sectionPadding = variant === 'section'
    ? 'pt-8 pb-16 md:pt-12 md:pb-20'
    : 'pt-4 pb-16 md:pt-8 md:pb-24'
  const containerClasses = variant === 'section'
    ? 'relative max-w-6xl md:max-w-7xl mx-auto bg-white/95 rounded-[32px] shadow-xl border border-white/60 px-6 py-10 md:px-12 md:py-12 overflow-hidden'
    : 'max-w-7xl mx-auto'

  return (
    <div className={`relative z-10 ${sectionPadding} px-4`}>
      <div className={containerClasses}>
        {variant === 'section' && (
          <>
            <div className="pointer-events-none absolute -top-12 -left-12 hidden md:block h-32 w-32 rounded-full bg-pastel opacity-50 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -right-16 hidden md:block h-40 w-40 rounded-full bg-tertiary-light opacity-70 blur-3xl" />
          </>
        )}
        <div className="relative z-10">
          {/* Título centrado (siempre visible) */}
          <div className="mb-6 text-center">
            <h2 className="text-3xl md:text-4xl font-libre-baskerville text-accent mb-2.5">
              Contáctame
            </h2>
            <div className="w-20 h-1 bg-secondary rounded-full mx-auto mb-4" />
            <p className="text-gray-600 max-w-2xl mx-auto">
              Si necesitas información adicional, deseas colaborar o simplemente continuar la conversación, déjame tus datos y te responderé a la brevedad.
            </p>
          </div>

          <div className={showImage ? 'grid md:grid-cols-2 gap-10 lg:gap-16 items-center' : 'max-w-2xl mx-auto'}>

          {/* Imagen */}
            {showImage && (
              <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-lg">
                <Image
                  src="/images/contacto.jpg"
                  alt="Contáctame - Apoyo emocional"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority={variant === 'page'}
                />
                {/* Bolitas decorativas */}
                <div className="absolute top-10 left-10 w-20 h-20 bg-primary opacity-20 rounded-full" />
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-tertiary opacity-15 rounded-full" />
              </div>
            )}

          {/* Formulario */}
            <div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Celular (opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 text-white rounded-lg font-semibold transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
                  style={{ backgroundColor: 'var(--color-accent)' }}
                >
                  {loading ? 'Enviando...' : 'Enviar mensaje'}
                  <FaPaperPlane className="text-sm" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
