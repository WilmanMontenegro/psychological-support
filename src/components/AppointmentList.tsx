"use client";

import React from "react";
import Link from "next/link";
import { type UserProfile } from "@/lib/auth";

// Types
export type Cita = {
  id: string;
  created_at: string;
  patient_id: string;
  psychologist_id: string | null;
  is_anonymous: boolean;
  problem_type: string;
  modality: string;
  preferred_date: string;
  preferred_time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "finalizada";
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

// Helper functions
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

const hasAppointmentPassed = (cita: Cita) => {
  const appointmentDateTime = getAppointmentDateTime(cita);
  if (!appointmentDateTime) return false;
  const now = new Date();
  // Consideramos pasada si ya ocurrió la hora exacta + 20 min (duración)
  const endDateTime = new Date(
    appointmentDateTime.getTime() + 20 * 60 * 1000,
  );
  return now > endDateTime;
};

// Lógica de Estado Visual
const getVisualStatus = (cita: Cita) => {
  const isPassed = hasAppointmentPassed(cita);

  if (cita.status === "cancelled") return "Cancelada";
  if (cita.status === "finalizada" || cita.status === "completed") return "Finalizada";

  if (cita.status === "confirmed") {
    return isPassed ? "Finalizada" : "Confirmada";
  }

  if (cita.status === "pending") {
    // Si una cita pendiente ya pasó, en la práctica está cancelada/expirada
    return isPassed ? "Cancelada" : "Pendiente";
  }

  return cita.status;
};

const getStatusColor = (visualStatus: string) => {
  switch (visualStatus) {
    case "Pendiente":
      return "bg-pastel text-gray-700 border-gray-300";
    case "Confirmada":
      return "bg-pastel-light text-accent border-secondary/30";
    case "Finalizada":
      return "bg-green-50 text-green-700 border-green-200"; // Color de éxito para finalizada
    case "Cancelada":
    case "No Realizada":
    case "Rechazada":
      return "bg-gray-100 text-gray-600 border-gray-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const getProblemTypeText = (type: string) => {
  switch (type) {
    case "couple":
      return "Problemas de Pareja";
    case "anxiety":
      return "Ansiedad";
    case "emotions":
      return "Manejo de Emociones";
    case "unknown":
      return "No sé qué tengo";
    default:
      return type;
  }
};

const canJoinAppointment = (cita: Cita, currentProfile: UserProfile | null) => {
  if (!currentProfile) return false;
  const isParticipant =
    cita.patient_id === currentProfile.id ||
    cita.psychologist_id === currentProfile.id;
  // Permitir entrar al chat si está confirmada o si está "auto-finalizada" (para seguimiento)
  // Pero visualmente debe estar confirmada en BD.
  return isParticipant && cita.status === "confirmed";
};

interface AppointmentListProps {
  citas: Cita[];
  currentProfile: UserProfile | null;
  activeChatAppointmentId: string | null;
  onSelectChat: (id: string) => void;
  onCancelCita: (id: string) => void;
  onUpdateCitaStatus: (id: string, status: Cita["status"]) => void;
  onOpenFeedbackModal: (id: string) => void;
  onDeleteCita: (id: string) => void;
}

export default function AppointmentList({
  citas,
  currentProfile,
  activeChatAppointmentId,
  onSelectChat,
  onCancelCita,
  onUpdateCitaStatus,
  onOpenFeedbackModal,
  onDeleteCita,
}: AppointmentListProps) {
  const isPatient = currentProfile?.role === "patient";
  const isPsychologist = currentProfile?.role === "psychologist";
  const isAdmin = currentProfile?.role === "admin";

  if (citas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center h-full flex flex-col justify-center">
        <p className="text-gray-600 mb-4">
          {isPsychologist
            ? "Aún no tienes citas asignadas."
            : isAdmin
              ? "No hay citas registradas en este momento."
              : "No tienes citas agendadas"}
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
    );
  }

  return (
    <div className="space-y-4">
      {citas.map((cita) => {
        const isPassed = hasAppointmentPassed(cita);
        const isActive = cita.id === activeChatAppointmentId;
        const visualStatus = getVisualStatus(cita);

        return (
          <div
            key={cita.id}
            onClick={() =>
              canJoinAppointment(cita, currentProfile) && onSelectChat(cita.id)
            }
            className={`bg-white rounded-lg shadow-md p-4 transition-all duration-300 ${isActive ? "ring-2 ring-accent shadow-xl" : "hover:shadow-lg"} ${canJoinAppointment(cita, currentProfile) ? "cursor-pointer" : "cursor-default"}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-md font-semibold text-accent">
                    {getProblemTypeText(cita.problem_type)}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(visualStatus)}`}
                  >
                    {visualStatus}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {new Date(cita.preferred_date).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      timeZone: "UTC",
                    })}
                  </p>
                  <p>
                    <strong>Hora:</strong> {cita.preferred_time}
                  </p>
                  {(isPsychologist || isAdmin) && (
                    <p>
                      <strong>Paciente:</strong>{" "}
                      {cita.is_anonymous
                        ? "Reserva anónima"
                        : cita.patient?.full_name || "N/A"}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Botones de Acción */}
              <div className="flex flex-col gap-2 items-end self-center sm:self-end">
                {(() => {
                  // --- Lógica de Botones para Psicólogo ---
                  if (isPsychologist) {
                    // Cita Pendiente Futura: Aceptar / Rechazar
                    if (cita.status === "pending" && !isPassed) {
                      return (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateCitaStatus(cita.id, "confirmed");
                            }}
                            className="px-3 py-1 text-xs text-white rounded-md transition"
                            style={{ backgroundColor: "var(--color-secondary)" }}
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateCitaStatus(cita.id, "cancelled");
                            }}
                            className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                          >
                            Rechazar
                          </button>
                        </div>
                      );
                    }

                    // Cita Confirmada Futura: Finalizar (Manual)
                    if (cita.status === "confirmed" && !isPassed) {
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenFeedbackModal(cita.id);
                          }}
                          className="px-3 py-1 text-xs text-white rounded-md transition"
                          style={{ backgroundColor: "var(--color-secondary)" }}
                        >
                          Finalizar cita
                        </button>
                      );
                    }

                    // Cita Auto-Finalizada (Pasada) o Ya Finalizada: Feedback y No Realizada
                    // Se muestra si es "confirmed" y pasó, O si ya es "finalizada"/"completed"
                    if (
                      (cita.status === "confirmed" && isPassed) ||
                      cita.status === "finalizada" ||
                      cita.status === "completed"
                    ) {
                      return (
                        <div className="flex flex-col gap-2 items-end">
                           <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenFeedbackModal(cita.id);
                            }}
                            className="px-3 py-1 text-xs text-white rounded-md transition hover:opacity-90"
                            style={{ backgroundColor: "var(--color-secondary)" }}
                          >
                            {cita.psychologist_feedback ? "Editar Nota" : "Agregar Nota"}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if(confirm("¿Marcar esta cita como No Realizada? Pasará a estado Cancelado.")) {
                                onUpdateCitaStatus(cita.id, "cancelled");
                              }
                            }}
                            className="px-3 py-1 text-xs text-gray-500 hover:text-red-600 underline transition"
                          >
                            Marcar No Realizada
                          </button>
                        </div>
                      );
                    }

                    // Cita Cancelada o Pendiente Expirada: Eliminar
                    if (cita.status === "cancelled" || (cita.status === "pending" && isPassed)) {
                      return (
                         <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteCita(cita.id);
                          }}
                          className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Eliminar
                        </button>
                      );
                    }
                  }

                  // --- Lógica de Botones para Paciente ---
                  if (isPatient) {
                    if (cita.status === "pending" && !isPassed) {
                      return (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelCita(cita.id);
                          }}
                          className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Cancelar
                        </button>
                      );
                    }
                  }

                  return null;
                })()}

                {/* Botón de Chat (Común) */}
                {canJoinAppointment(cita, currentProfile) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChat(cita.id);
                    }}
                    className={`px-3 py-1 text-xs text-white rounded-md transition hover:opacity-90 ${isActive ? "bg-secondary" : "bg-accent"}`}
                  >
                    {isActive ? "Viendo Chat" : "Ir al Chat"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
