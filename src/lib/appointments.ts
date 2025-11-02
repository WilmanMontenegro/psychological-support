import { supabase } from './supabase';

export type AppointmentMessage = {
  id: string;
  appointment_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export async function fetchAppointmentMessages(
  appointmentId: string
): Promise<AppointmentMessage[]> {
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
  const { error } = await supabase.from('appointment_messages').insert({
    appointment_id: appointmentId,
    sender_id: senderId,
    message,
  });

  if (error) {
    throw error;
  }
}
