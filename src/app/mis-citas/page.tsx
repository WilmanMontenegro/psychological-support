'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Cita = {
  id: string;
  created_at: string;
  is_anonymous: boolean;
  problem_type: string;
  modality: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
};

export default function MisCitasPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      checkUserAndLoadCitas();
    }
  }, []);

  const checkUserAndLoadCitas = async () => {
    const profile = await getUserProfile();

    if (!profile) {
      router.push('/login');
      return;
    }

    setUserRole(profile.role);
    await loadCitas(profile.id);
    setLoading(false);
  };

  const loadCitas = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', userId)
        .order('preferred_date', { ascending: false });

      if (error) throw error;

      setCitas(data || []);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      toast.error('Error al cargar tus citas');
    }
  };

  const cancelarCita = async (citaId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', citaId);

      if (error) throw error;

      toast.success('Cita cancelada exitosamente');
      const profile = await getUserProfile();
      if (profile) {
        await loadCitas(profile.id);
      }
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      toast.error('Error al cancelar la cita');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'completed':
        return 'Completada';
      default:
        return status;
    }
  };

  const getProblemTypeText = (type: string) => {
    switch (type) {
      case 'couple':
        return 'Problemas de Pareja';
      case 'anxiety':
        return 'Ansiedad';
      case 'emotions':
        return 'Manejo de Emociones';
      case 'unknown':
        return 'No sé qué tengo';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <p className="text-gray-600">Cargando tus citas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            Mis Citas
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 mb-6">
            Aquí puedes ver y administrar todas tus citas agendadas
          </p>
          {userRole === 'patient' && (
            <Link
              href="/agendar-cita"
              className="inline-block text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              Agendar Nueva Cita
            </Link>
          )}
        </div>

        {/* Lista de Citas */}
        {citas.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No tienes citas agendadas</p>
            {userRole === 'patient' && (
              <Link
                href="/agendar-cita"
                className="text-secondary hover:underline font-medium"
              >
                Agenda tu primera cita aquí
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {citas.map((cita) => (
              <div
                key={cita.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Información de la cita */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-accent">
                        {getProblemTypeText(cita.problem_type)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          cita.status
                        )}`}
                      >
                        {getStatusText(cita.status)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Fecha:</strong>{' '}
                        {new Date(cita.preferred_date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p>
                        <strong>Hora:</strong> {cita.preferred_time}
                      </p>
                      <p>
                        <strong>Modalidad:</strong>{' '}
                        {cita.modality === 'video' ? 'Videollamada' : 'Chat'}
                      </p>
                      <p>
                        <strong>Tipo:</strong>{' '}
                        {cita.is_anonymous ? 'Anónimo' : 'Normal'}
                      </p>
                    </div>
                  </div>

                  {/* Acciones */}
                  {cita.status === 'pending' && (
                    <div className="flex sm:flex-col gap-2">
                      <button
                        onClick={() => cancelarCita(cita.id)}
                        className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
