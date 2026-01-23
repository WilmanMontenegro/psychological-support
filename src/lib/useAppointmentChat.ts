import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from './supabase';
import { fetchAppointmentMessages, sendAppointmentMessage, type AppointmentMessage } from './appointments';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useAppointmentChat(appointmentId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<AppointmentMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const isMountedRef = useRef(true);

  const loadMessages = useCallback(async () => {
    if (!appointmentId || !userId) return;

    try {
      setLoading(true);
      const data = await fetchAppointmentMessages(appointmentId, userId);
      if (isMountedRef.current) {
        setMessages(data);
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      throw error;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [appointmentId, userId]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!appointmentId || !userId || !message.trim()) {
        throw new Error('Datos requeridos faltantes o mensaje vacío');
      }

      try {
        setSending(true);
        await sendAppointmentMessage(appointmentId, userId, message);
      } finally {
        if (isMountedRef.current) {
          setSending(false);
        }
      }
    },
    [appointmentId, userId]
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!appointmentId) {
      setMessages([]);
      return;
    }

    let isMounted = true;

    const setupChat = async () => {
      try {
        await loadMessages();

        if (!isMounted) return;

        // Configurar realtime channel
        channelRef.current = supabase
          .channel(`appointment-messages-${appointmentId}`)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'appointment_messages',
              filter: `appointment_id=eq.${appointmentId}`,
            },
            (payload) => {
              if (!isMounted) return;
              const newMessage = payload.new as AppointmentMessage;
              setMessages((prev) => [...prev, newMessage]);
            }
          )
          .subscribe();
      } catch (error) {
        console.error('Error al configurar chat:', error);
      }
    };

    setupChat();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [appointmentId, loadMessages]);

  return {
    messages,
    loading,
    sending,
    sendMessage,
  };
}
