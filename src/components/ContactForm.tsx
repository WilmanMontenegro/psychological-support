'use client';

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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
    } catch (error) {
      toast.error('Error al enviar el mensaje. Intenta nuevamente');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${variant === 'page' ? 'py-20' : 'py-16'} px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Título centrado (siempre visible) */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-libre-baskerville text-accent mb-4">
            Contáctame
          </h2>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ¿Tienes dudas o quieres agendar una consulta? Escríbeme y te responderé a la brevedad.
          </p>
        </div>

        <div className={showImage ? 'grid md:grid-cols-2 gap-12 items-center' : 'max-w-2xl mx-auto'}>

          {/* Imagen */}
          {showImage && (
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
              <img
                src="/images/preocupada2.jpg"
                alt="Contáctame"
                className="w-full h-full object-cover"
              />
              {/* Bolitas decorativas */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-primary opacity-20 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-tertiary opacity-15 rounded-full"></div>
            </div>
          )}

          {/* Formulario */}
          <div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 text-white rounded-lg font-medium transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
