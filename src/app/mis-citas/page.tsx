'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserProfile, type UserProfile } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  fetchAppointmentMessages,
  sendAppointmentMessage,
  type AppointmentMessage,
} from '@/lib/appointments';

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
  const [chatMessages, setChatMessages] = useState<AppointmentMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

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
        setChatMessages([]);
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
        setChatMessages([]);
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

    return now >= appointmentDateTime;
  };

  const handleJoinAppointment = (citaId: string) => {
    setActiveChatAppointmentId((current) =>
      current === citaId ? current : citaId
    );
  };

  const handleCloseChat = () => {
    setActiveChatAppointmentId(null);
    setChatMessages([]);
  };

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = chatInput.trim();

    if (!message || !activeChatAppointmentId || !currentProfile) {
      return;
    }

    try {
      setSendingMessage(true);
      await sendAppointmentMessage(activeChatAppointmentId, currentProfile.id, message);
      setChatInput('');
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('No se pudo enviar el mensaje');
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    if (!activeChatAppointmentId) {
      setChatLoading(false);
      return;
    }

    let isMounted = true;
    let channel: RealtimeChannel | null = null;

    const loadMessages = async () => {
      try {
        setChatLoading(true);
        const data = await fetchAppointmentMessages(activeChatAppointmentId);
        if (isMounted) {
          setChatMessages(data);
        }
      } catch (error) {
        console.error('Error al cargar mensajes de la cita:', error);
        if (isMounted) {
          toast.error('No se pudieron cargar los mensajes');
        }
      } finally {
        if (isMounted) {
          setChatLoading(false);
        }
      }
    };

    loadMessages();

    channel = supabase
      .channel(`appointment-messages-${activeChatAppointmentId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointment_messages',
          filter: `appointment_id=eq.${activeChatAppointmentId}`,
        },
        (payload) => {
          if (!isMounted) return;
          const newMessage = payload.new as AppointmentMessage;
          setChatMessages((prev) => [...prev, newMessage]);
        }
      );

    channel.subscribe();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeChatAppointmentId]);

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
                            cita.status
                          )}`}
                        >
                          {getStatusText(cita.status)}
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
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-base font-semibold text-accent">
                          Chat de la cita
                        </h4>
                        <button
                          onClick={handleCloseChat}
                          className="text-sm text-gray-500 hover:text-gray-700 transition"
                        >
                          Cerrar chat
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                        <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                          {chatLoading ? (
                            <p className="text-sm text-gray-500">Cargando mensajes...</p>
                          ) : chatMessages.length === 0 ? (
                            <p className="text-sm text-gray-500">
                              No hay mensajes todavía. ¡Empieza la conversación!
                            </p>
                          ) : (
                            chatMessages.map((message) => {
                              const isOwnMessage = message.sender_id === currentProfile.id;
                              const messageDate = new Date(message.created_at);
                              const formattedTime = messageDate.toLocaleTimeString('es-ES', {
                                hour: '2-digit',
                                minute: '2-digit',
                              });

                              return (
                                <div
                                  key={message.id}
                                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div
                                    className={`rounded-lg px-3 py-2 max-w-xs text-sm ${
                                      isOwnMessage
                                        ? 'bg-accent text-white'
                                        : 'bg-white border border-gray-200 text-gray-800'
                                    }`}
                                  >
                                    <p>{message.message}</p>
                                    <span className="block mt-1 text-xs opacity-75 text-right">
                                      {formattedTime}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          )}
                          <div ref={chatBottomRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                            placeholder="Escribe un mensaje..."
                            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                            disabled={sendingMessage}
                          />
                          <button
                            type="submit"
                            disabled={sendingMessage || !chatInput.trim()}
                            className="px-4 py-2 text-sm text-white rounded-md transition disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-secondary)' }}
                          >
                            {sendingMessage ? 'Enviando...' : 'Enviar'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
