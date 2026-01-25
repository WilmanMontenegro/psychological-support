import { useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "./supabase";
import {
  fetchAppointmentMessages,
  sendAppointmentMessage,
  type AppointmentMessage,
} from "./appointments";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useAppointmentChat(
  appointmentId: string | null,
  userId: string | null,
) {
  const [messages, setMessages] = useState<AppointmentMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!appointmentId || !userId || !message.trim()) {
        throw new Error("Datos requeridos faltantes o mensaje vacío");
      }
      try {
        setSending(true);
        // We don't need to manually refetch or append the message here,
        // as the realtime subscription will handle adding it to the state.
        await sendAppointmentMessage(appointmentId, userId, message);
      } finally {
        setSending(false);
      }
    },
    [appointmentId, userId],
  );

  useEffect(() => {
    // If there's no appointment ID, clear messages and do nothing.
    if (!appointmentId || !userId) {
      setMessages([]);
      return;
    }

    // --- 1. Initial Load ---
    const loadInitialMessages = async () => {
      setLoading(true);
      try {
        const initialData = await fetchAppointmentMessages(
          appointmentId,
          userId,
        );
        setMessages(initialData);
      } catch (error) {
        console.error("[Chat] Error fetching initial messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialMessages();

    // --- 2. Realtime Subscription ---
    const handleNewMessage = (payload: { new: AppointmentMessage }) => {
      console.log("[Chat] Realtime event received:", payload);
      const newMessage = payload.new as AppointmentMessage;
      // Add message only if it's not already in the list
      // This prevents duplicates from the initial load and the subscription firing simultaneously
      setMessages((prevMessages) => {
        if (prevMessages.some((msg) => msg.id === newMessage.id)) {
          return prevMessages;
        }
        return [...prevMessages, newMessage];
      });
    };

    const channel = supabase
      .channel(`appointment-messages-${appointmentId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "appointment_messages",
          filter: `appointment_id=eq.${appointmentId}`,
        },
        handleNewMessage,
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log(
            `[Chat] Subscribed successfully to channel: appointment-messages-${appointmentId}`,
          );
        } else if (status === "CHANNEL_ERROR") {
          console.error("[Chat] Subscription failed:", err);
          toast.error(
            "Error de conexión con el chat. Intenta recargar la página.",
          );
        }
      });

    channelRef.current = channel;

    // --- 3. Cleanup ---
    return () => {
      console.log(
        `[Chat] Cleaning up and unsubscribing from channel: appointment-messages-${appointmentId}`,
      );
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [appointmentId, userId]); // Re-run effect if appointmentId or userId changes

  return {
    messages,
    loading,
    sending,
    sendMessage,
  };
}
