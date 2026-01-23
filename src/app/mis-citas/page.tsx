'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserProfile, type UserProfile } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AppointmentChat from '@/components/AppointmentChat';

type Cita = {
  id: string;
  created_at: string;
  patient_id: string;
  psychologist_id: string | null;
  is_anonymous: boolean;
  problem_type: string;
  modality: string;
  preferred_date: string;
  preferred_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  psychologist_feedback?: string | null;
  completed_at?: string | null;
  patient?: {
    full_name: string | null;
    phone?: string | null;
  } | null;
  psychologist?: {
    full_name: string | null;
    phone?: string | null;
  } | null;
};

export default function MisCitasPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>('');
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);
  const [activeChatAppointmentId, setActiveChatAppointmentId] = useState<string | null>(null);
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; citaId: string | null }>({ open: false, citaId: null });
  const [feedbackText, setFeedbackText] = useState('');
  const [savingFeedback, setSavingFeedback] = useState(false);

  const loadCitas = useCallback(async (profile: UserProfile) => {
    try {
      const baseSelect =
        profile.role === 'admin'
          ? `
              *,
              patient:profiles!appointments_patient_id_fkey(full_name, phone),
              psychologist:profiles!appointments_psychologist_id_fkey(full_name, phone)
            `
          : profile.role === 'psychologist'
          ? `
              *,
              patient:profiles!appointments_patient_id_fkey(full_name, phone)
            `
          : `
              *,
              psychologist:profiles!appointments_psychologist_id_fkey(full_name)
            `;

      let query = supabase
        .from('appointments')
        .select(baseSelect.trim())
        .order('preferred_date', { ascending: false });

      if (profile.role === 'patient') {
        query = query.eq('patient_id', profile.id);
      } else if (profile.role === 'psychologist') {
        query = query.eq('psychologist_id', profile.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      setCitas((data as unknown as Cita[]) || []);
    } catch (error) {
      console.error('Error al cargar citas:', error);
      toast.error('Error al cargar tus citas');
    }
  }, []);

  const checkUserAndLoadCitas = useCallback(async () => {
    try {
      const profile = await getUserProfile();

      if (!profile) {
        router.push('/login');
        return;
      }

      setUserRole(profile.role);
      setCurrentProfile(profile);
      await loadCitas(profile);
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      toast.error('No se pudo cargar la información de tu cuenta. Intenta nuevamente.');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router, loadCitas]);

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      void checkUserAndLoadCitas();
    }
  }, [checkUserAndLoadCitas]);

  const cancelarCita = async (citaId: string) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      return;
    }

    if (!currentProfile) {
      toast.error('No se pudo validar tu sesión. Intenta iniciar sesión nuevamente.');
      return;
    }

    try {
      let query = supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', citaId);

      if (currentProfile.role === 'patient') {
        query = query.eq('patient_id', currentProfile.id);
      } else if (currentProfile.role === 'psychologist') {
        query = query.eq('psychologist_id', currentProfile.id);
      }

      const { error } = await query;

      if (error) throw error;

      toast.success('Cita cancelada exitosamente');
      const profile = await getUserProfile();
      if (profile) {
        await loadCitas(profile);
      }
      if (activeChatAppointmentId === citaId) {
        setActiveChatAppointmentId(null);
      }
    } catch (error: unknown) {
      console.error('Error al cancelar cita:', error);
      const message =
        error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
          ? error.message
          : 'Error al cancelar la cita';
      toast.error(message);
    }
  };

  const actualizarEstadoCita = async (citaId: string, nuevoEstado: Cita['status']) => {
    try {
      if (!currentProfile) {
        toast.error('No se pudo validar tu sesión. Intenta iniciar sesión nuevamente.');
        return;
      }

      let query = supabase
        .from('appointments')
        .update({ status: nuevoEstado })
        .eq('id', citaId);

      if (currentProfile.role === 'psychologist') {
        query = query.eq('psychologist_id', currentProfile.id);
      } else if (currentProfile.role === 'patient') {
        query = query.eq('patient_id', currentProfile.id);
      }

      const { error } = await query;

      if (error) throw error;

      const profile = await getUserProfile();
      if (profile) {
        await loadCitas(profile);
      }

      const successMessage =
        nuevoEstado === 'confirmed'
          ? 'Cita confirmada exitosamente'
          : 'Cita cancelada';

      toast.success(successMessage);

      if (nuevoEstado !== 'confirmed' && activeChatAppointmentId === citaId) {
        setActiveChatAppointmentId(null);
      }
    } catch (error: unknown) {
      console.error('Error al actualizar la cita:', error);
      const message =
        error && typeof error === 'object' && 'message' in error && typeof error.message === 'string'
          ? error.message
          : 'No se pudo actualizar el estado de la cita';
      toast.error(message);
    }
  };

  const marcarComoCompletada = async () => {
    if (!feedbackModal.citaId || !feedbackText.trim()) {
      toast.error('Por favor escribe una retroalimentación');
      return;
    }

    setSavingFeedback(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          status: 'finalizada',
          psychologist_feedback: feedbackText,
          completed_at: new Date().toISOString()
        })
        .eq('id', feedbackModal.citaId);

      if (error) throw error;

      toast.success('Cita finalizada exitosamente');
      setFeedbackModal({ open: false, citaId: null });
      setFeedbackText('');
      
      if (currentProfile) {
        await loadCitas(currentProfile);
      }
    } catch (error) {
      console.error('Error al marcar cita como completada:', error);
      toast.error('Error al finalizar la cita');
    } finally {
      setSavingFeedback(false);
    }
  };

  const eliminarCita = async (citaId: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', citaId);

      if (error) throw error;

      toast.success('Cita eliminada');
      
      if (currentProfile) {
        await loadCitas(currentProfile);
      }
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      toast.error('Error al eliminar la cita');
    }
  };

  const getAppointmentDateTime = (cita: Cita) => {
    if (!cita.preferred_date || !cita.preferred_time) {
      return null;
    }

    const dateTime = new Date(`${cita.preferred_date}T${cita.preferred_time}`);
    if (Number.isNaN(dateTime.getTime())) {
      return null;
    }

    return dateTime;
  };

  const canJoinAppointment = (cita: Cita) => {
    if (!currentProfile) return false;

    const isParticipant =
      cita.patient_id === currentProfile.id ||
      cita.psychologist_id === currentProfile.id;

    if (!isParticipant || cita.status !== 'confirmed') {
      return false;
    }

    const appointmentDateTime = getAppointmentDateTime(cita);
    if (!appointmentDateTime) {
      return false;
    }

    const now = new Date();

    const isSameDay =
      now.getFullYear() === appointmentDateTime.getFullYear() &&
      now.getMonth() === appointmentDateTime.getMonth() &&
      now.getDate() === appointmentDateTime.getDate();

    if (!isSameDay) {
      return false;
    }

    // Permitir acceso 15 minutos antes de la hora programada
    const fifteenMinutesBefore = new Date(appointmentDateTime.getTime() - 15 * 60 * 1000);
    return now >= fifteenMinutesBefore;
  };

  const handleJoinAppointment = (citaId: string) => {
    setActiveChatAppointmentId((current) =>
      current === citaId ? null : citaId
    );
  };

  const isAppointmentExpired = (cita: Cita) => {
    if (cita.status !== 'confirmed') return false;
    
    const appointmentDateTime = getAppointmentDateTime(cita);
    if (!appointmentDateTime) return false;
    
    const now = new Date();
    // Considerar vencida si pasaron más de 2 horas desde la hora programada
    const twoHoursAfter = new Date(appointmentDateTime.getTime() + 2 * 60 * 60 * 1000);
    return now > twoHoursAfter;
  };

  const getAppointmentStatus = (cita: Cita) => {
    if (isAppointmentExpired(cita)) return 'vencida';
    return cita.status;
  };

  const getStatusColor = (status: string, isExpired = false) => {
    if (isExpired) {
      return 'bg-red-50 text-red-700 border-red-300';
    }
    if (isExpired) {
      return 'bg-red-50 text-red-700 border-red-300';
    }
    switch (status) {
      case 'pending':
        return 'bg-pastel text-gray-700 border-gray-300';
      case 'confirmed':
        return 'bg-pastel-light text-accent border-secondary/30';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'finalizada':
        return 'bg-pastel-light text-secondary border-secondary/30';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusText = (status: string, isExpired = false) => {
    if (isExpired) {
      return 'Vencida';
    }
    switch (status) {
      case 'pending':
        return 'Pendiente';
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      case 'finalizada':
        return 'Finalizada';
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
        <p className="text-gray-600">
          {userRole === 'psychologist'
            ? 'Cargando citas asignadas...'
            : userRole === 'admin'
            ? 'Cargando todas las citas...'
            : 'Cargando tus citas...'}
        </p>
      </div>
    );
  }

  const isPatient = userRole === 'patient';
  const isPsychologist = userRole === 'psychologist';
  const isAdmin = userRole === 'admin';

  const pageTitle = isPsychologist
    ? 'Citas Asignadas'
    : isAdmin
    ? 'Todas las Citas'
    : 'Mis Citas';

  const pageDescription = isPsychologist
    ? 'Revisa las citas que los pacientes han reservado contigo.'
    : isAdmin
    ? 'Consulta el estado de todas las citas agendadas en la plataforma.'
    : 'Aquí puedes ver y administrar todas tus citas agendadas';

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            {pageTitle}
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 mb-6">
            {pageDescription}
          </p>
          {isPatient && (
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
            <p className="text-gray-600 mb-4">
              {isPsychologist
                ? 'Aún no tienes citas asignadas.'
                : isAdmin
                ? 'No hay citas registradas en este momento.'
                : 'No tienes citas agendadas'}
            </p>
            {isPatient && (
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
            {citas.map((cita) => {
              const contactDetails = [cita.patient?.phone].filter(
                (value): value is string => Boolean(value)
              );

              const isExpired = isAppointmentExpired(cita);

              return (
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
                            cita.status,
                            isExpired
                          )}`}
                        >
                          {getStatusText(cita.status, isExpired)}
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <strong>Fecha:</strong>{' '}
                        {(() => {
                          const [year, month, day] = (cita.preferred_date || '').split('-').map(Number);
                          const displayDate = Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)
                            ? new Date(year, month - 1, day)
                            : new Date(cita.preferred_date);

                          return displayDate.toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          });
                        })()}
                      </p>
                        <p>
                          <strong>Hora:</strong> {cita.preferred_time}
                        </p>
                        <p>
                          <strong>Modalidad:</strong>{' '}
                          {cita.modality === 'video' ? 'Videollamada' : 'Chat'}
                        </p>
                        {(isPsychologist || isAdmin) && (
                          <p>
                            <strong>Paciente:</strong>{' '}
                            {cita.is_anonymous
                              ? 'Reserva anónima'
                              : cita.patient?.full_name || 'Sin especificar'}
                          </p>
                        )}
                        {(isPsychologist || isAdmin) &&
                          !cita.is_anonymous &&
                          contactDetails.length > 0 && (
                            <p>
                              <strong>Contacto:</strong> {contactDetails.join(' • ')}
                            </p>
                          )}
                        {isAdmin && (
                          <p>
                            <strong>Profesional:</strong>{' '}
                            {cita.psychologist?.full_name || 'No asignado'}
                          </p>
                        )}
                        <p>
                          <strong>Tipo:</strong>{' '}
                          {cita.is_anonymous ? 'Anónimo' : 'Normal'}
                        </p>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 sm:items-end">
                      {isPsychologist && cita.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => actualizarEstadoCita(cita.id, 'confirmed')}
                            className="px-4 py-2 text-sm text-white rounded-md transition"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => actualizarEstadoCita(cita.id, 'cancelled')}
                            className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}

                      {isPsychologist && cita.status === 'confirmed' && !isExpired && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setFeedbackModal({ open: true, citaId: cita.id })}
                            className="px-4 py-2 text-sm text-white rounded-md transition"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                          >
                            Finalizar cita
                          </button>
                        </div>
                      )}

                      {isPsychologist && getAppointmentStatus(cita) === 'vencida' && cita.status !== 'finalizada' && (
                        <button
                          onClick={() => eliminarCita(cita.id)}
                          className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Eliminar
                        </button>
                      )}

                      {isPatient && cita.status === 'pending' && (
                        <button
                          onClick={() => cancelarCita(cita.id)}
                          className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Cancelar
                        </button>
                      )}

                      {canJoinAppointment(cita) && (
                        <button
                          onClick={() => handleJoinAppointment(cita.id)}
                          className="px-4 py-2 text-sm text-white rounded-md transition hover:opacity-90"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                        >
                          Ir a cita
                        </button>
                      )}
                    </div>
                  </div>
                  {activeChatAppointmentId === cita.id && currentProfile && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <h4 className="text-base font-semibold text-accent mb-4">
                        Mensajes de la Cita
                      </h4>
                      <AppointmentChat appointmentId={cita.id} userId={currentProfile.id} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Retroalimentación */}
      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8">
            <h3 className="text-xl font-libre-baskerville text-accent mb-2">Finalizar Cita</h3>
            <div className="w-12 h-1 bg-secondary rounded-full mb-6"></div>
            
            <p className="text-sm text-gray-600 mb-4">
              Comparte tus observaciones sobre cómo viste al paciente
            </p>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Ej: Paciente presentó mejora en ansiedad, se recomienda continuar con técnicas de respiración..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none text-sm"
              rows={5}
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setFeedbackModal({ open: false, citaId: null });
                  setFeedbackText('');
                }}
                disabled={savingFeedback}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={marcarComoCompletada}
                disabled={savingFeedback || !feedbackText.trim()}
                className="flex-1 px-4 py-2 text-white rounded-lg transition disabled:opacity-50 font-medium text-sm hover:opacity-90"
                style={{ backgroundColor: 'var(--color-secondary)' }}
              >
                {savingFeedback ? 'Guardando...' : 'Finalizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
