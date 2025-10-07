'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type ProblemType = 'couple' | 'anxiety' | 'emotions' | 'unknown';
type Modality = 'video' | 'chat';

export default function AgendarCitaPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    isAnonymous: false,
    problemType: '' as ProblemType | '',
    modality: '' as Modality | '',
    date: '',
    time: ''
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
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setFormData({
        ...formData,
        isAnonymous: value === 'anonymous'
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const loadingToast = toast.loading('Agendando tu cita...');

    try {
      // Guardar la cita en la base de datos
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          is_anonymous: formData.isAnonymous,
          problem_type: formData.problemType,
          modality: formData.modality,
          preferred_date: formData.date,
          preferred_time: formData.time,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast.dismiss(loadingToast);
      toast.success('¡Cita agendada exitosamente! Te contactaremos pronto');

      setSuccess(true);

      // Redirigir a mis citas después de 2 segundos
      setTimeout(() => {
        router.push('/mis-citas');
      }, 2000);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al agendar la cita. Por favor intenta nuevamente');
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
                  checked={!formData.isAnonymous}
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
                  value="anonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="mr-2"
                  style={{ accentColor: 'var(--color-secondary)' }}
                />
                <span>Anónimo</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.isAnonymous
                ? 'Tu identidad será completamente anónima en esta consulta'
                : 'Usaremos la información de tu perfil para esta consulta'}
            </p>
          </div>

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
              <option value="couple">Problemas de Pareja</option>
              <option value="anxiety">Ansiedad</option>
              <option value="emotions">Manejo de Emociones</option>
              <option value="unknown">No sé qué tengo</option>
            </select>
          </div>

          {/* Tipo de Sesión */}
          <div>
            <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad de la Cita
            </label>
            <select
              id="modality"
              name="modality"
              required
              value={formData.modality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona una opción</option>
              <option value="video">Videollamada</option>
              <option value="chat">Chat</option>
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
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