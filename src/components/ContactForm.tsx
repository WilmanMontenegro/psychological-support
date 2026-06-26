'use client';

import Image from 'next/image';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ContactFormProps {
  showImage?: boolean;
  variant?: 'section' | 'page';
}

const inputClassName =
  'w-full px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition';

function ContactDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-10 top-6 h-28 w-28 rounded-full bg-secondary/20" />
      <div className="absolute -right-8 top-[18%] h-20 w-20 rounded-full bg-tertiary/20" />
      <div className="absolute -bottom-12 left-[10%] h-32 w-32 rounded-full bg-primary/15" />
    </div>
  );
}

export default function ContactForm({ showImage = true, variant = 'section' }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;

    if (e.target.name === 'phone') {
      value = value.replace(/[^0-9+\-\s]/g, '');
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
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
        body: JSON.stringify(formData),
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

  const sectionPadding = variant === 'section' ? 'py-16' : 'pt-4 pb-16 md:pt-8 md:pb-24';

  return (
    <div className={`relative w-full ${sectionPadding} px-4 md:px-6`}>
      <ContactDecorations />

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h2 className="mb-4 font-libre-baskerville text-3xl text-accent md:text-4xl">Contáctame</h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-secondary" />
          <p className="mx-auto max-w-2xl text-gray-600">
            ¿Tienes una idea, una propuesta o te gustaría colaborar con tupsicoana? Este espacio es para ti. Escríbeme y conversemos.
          </p>
        </div>

        <div
          className={
            showImage
              ? 'grid items-center gap-10 md:grid-cols-2 lg:gap-16'
              : 'mx-auto max-w-2xl'
          }
        >
          {showImage && (
            <div className="flex flex-col items-center">
              <div
                className="relative aspect-square w-[min(100vw-1.5rem,400px)] overflow-hidden rounded-full border-[3px] border-secondary/60 shadow-lg md:w-[500px]"
                style={{ backgroundColor: 'color-mix(in srgb, var(--color-secondary) 22%, white)' }}
              >
                <Image
                  src="/images/contacto.png"
                  alt="Ana Marcela - Tu Psico Ana"
                  fill
                  className="object-contain object-[48%_92%] scale-[1.06]"
                  sizes="(max-width: 768px) 400px, 500px"
                  priority={variant === 'page'}
                />
              </div>

              <p className="mt-5 max-w-xs text-center font-libre-baskerville text-sm leading-relaxed text-gray-600 md:max-w-sm">
                Creo en el poder de compartir conocimientos, sumar perspectivas y construir bienestar a través de la colaboración.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                Nombre completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                Correo electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-gray-700">
                Celular (opcional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-semibold text-gray-700">
                Mensaje *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`${inputClassName} resize-none`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-4 font-semibold text-white shadow-md transition hover:opacity-95 active:scale-[0.99] disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              {loading ? 'Enviando...' : 'Enviar mensaje'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
