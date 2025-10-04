'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type ConsultMode = 'normal' | 'anonimo';
type ProblemType = 'pareja' | 'ansiedad' | 'emociones' | 'no-se';
type SessionType = 'videollamada' | 'chat';
type Gender = 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir';

export default function AgendarCitaPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    consultMode: 'normal' as ConsultMode,
    name: '',
    age: '',
    gender: '' as Gender | '',
    problemType: '' as ProblemType | '',
    sessionType: '' as SessionType | ''
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Aquí guardarías la cita en Supabase
      // Por ahora solo simulamos el éxito
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess(true);

      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error al agendar cita:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-libre-baskerville text-accent mb-2">¡Cita Agendada!</h2>
          <p className="text-gray-600">Te contactaremos pronto para confirmar tu cita.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            Agendar Cita
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Duración de la consulta:</strong> 20 minutos
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-6">
          {/* Modo de Consulta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo de Consulta
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultMode"
                  value="normal"
                  checked={formData.consultMode === 'normal'}
                  onChange={handleChange}
                  className="mr-2"
                  style={{ accentColor: 'var(--color-secondary)' }}
                />
                <span>Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultMode"
                  value="anonimo"
                  checked={formData.consultMode === 'anonimo'}
                  onChange={handleChange}
                  className="mr-2"
                  style={{ accentColor: 'var(--color-secondary)' }}
                />
                <span>Anónimo</span>
              </label>
            </div>
          </div>

          {/* Datos personales (solo si es modo normal) */}
          {formData.consultMode === 'normal' && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="1"
                  max="120"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="25"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Selecciona una opción</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>
            </>
          )}

          {/* Tipo de Problema */}
          <div>
            <label htmlFor="problemType" className="block text-sm font-medium text-gray-700 mb-1">
              ¿Qué tipo de apoyo buscas?
            </label>
            <select
              id="problemType"
              name="problemType"
              required
              value={formData.problemType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona una opción</option>
              <option value="pareja">Problemas de Pareja</option>
              <option value="ansiedad">Ansiedad</option>
              <option value="emociones">Manejo de Emociones</option>
              <option value="no-se">No sé qué tengo</option>
            </select>
          </div>

          {/* Tipo de Sesión */}
          <div>
            <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad de la Cita
            </label>
            <select
              id="sessionType"
              name="sessionType"
              required
              value={formData.sessionType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona una opción</option>
              <option value="videollamada">Videollamada</option>
              <option value="chat">Chat</option>
            </select>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 text-white font-medium rounded-md transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              {submitting ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
