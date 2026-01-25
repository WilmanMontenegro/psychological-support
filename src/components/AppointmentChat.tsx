"use client";

import { useRef, useEffect, FormEvent } from "react";
import { useAppointmentChat } from "@/lib/useAppointmentChat";
import toast from "react-hot-toast";

interface AppointmentChatProps {
  appointmentId: string;
  userId: string;
}

export default function AppointmentChat({
  appointmentId,
  userId,
}: AppointmentChatProps) {
  const { messages, loading, sending, sendMessage } = useAppointmentChat(
    appointmentId,
    userId,
  );
  const chatInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const message = chatInputRef.current?.value?.trim();
    if (!message) {
      toast.error("Escribe un mensaje");
      return;
    }

    try {
      await sendMessage(message);
      if (chatInputRef.current) {
        chatInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      toast.error("No se pudo enviar el mensaje");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600 text-sm">Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Área de mensajes */}
      <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 sm:space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm text-center">
              No hay mensajes aún. <br />
              ¡Sé el primero en saludar!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`text-sm py-1.5 px-3 rounded-lg max-w-[85%] sm:max-w-md break-words ${
                  msg.sender_id === userId
                    ? "bg-secondary/20 text-gray-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Formulario de envío */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 p-3 sm:p-4 border-t border-gray-100 flex-shrink-0 bg-white"
      >
        <input
          ref={chatInputRef}
          type="text"
          placeholder="Escribe..."
          maxLength={500}
          disabled={sending}
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none disabled:opacity-50 transition"
        />
        <button
          type="submit"
          disabled={sending}
          className="px-4 sm:px-6 py-2 text-sm text-white rounded-full transition disabled:opacity-50 hover:opacity-90 font-medium"
          style={{ backgroundColor: "var(--color-secondary)" }}
        >
          {sending ? "..." : "Enviar"}
        </button>
      </form>
    </div>
  );
}
