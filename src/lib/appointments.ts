import { supabase } from './supabase';

export type AppointmentMessage = {
  id: string;
  appointment_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

const ADMIN_UID = '6278a2a5-e099-4a3f-81dc-920590863372';

async function canAccessAppointment(appointmentId: string, userId: string): Promise<boolean> {
  // 1. Acceso GOD MODE para el Admin
  if (userId === ADMIN_UID) {
    return true;
  }

  // 2. Verificar si es participante de la cita
  const { data, error } = await supabase
    .from('appointments')
    .select('patient_id, psychologist_id')
    .eq('id', appointmentId)
    .single();

  if (error || !data) {
    console.error('Error al verificar acceso a cita:', error);
    return false;
  }

  return data.patient_id === userId || data.psychologist_id === userId;
}

export async function fetchAppointmentMessages(
  appointmentId: string,
  userId: string
): Promise<AppointmentMessage[]> {
  // Verificar permisos
  const hasAccess = await canAccessAppointment(appointmentId, userId);
  if (!hasAccess) {
    throw new Error('No tienes permiso para acceder a esta cita');
  }

  const { data, error } = await supabase
    .from('appointment_messages')
    .select('*')
    .eq('appointment_id', appointmentId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function sendAppointmentMessage(
  appointmentId: string,
  senderId: string,
  message: string
): Promise<void> {
  // Validación de input
  if (!message || !message.trim()) {
    throw new Error('El mensaje no puede estar vacío');
  }

  if (message.length > 500) {
    throw new Error('El mensaje no puede exceder 500 caracteres');
  }

  // Verificar permisos
  const hasAccess = await canAccessAppointment(appointmentId, senderId);
  if (!hasAccess) {
    throw new Error('No tienes permiso para enviar mensajes en esta cita');
  }

  const { error } = await supabase.from('appointment_messages').insert({
    appointment_id: appointmentId,
    sender_id: senderId,
    message: message.trim(),
  });

  if (error) {
    throw error;
  }
}

