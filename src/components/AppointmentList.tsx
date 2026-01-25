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
  extension_minutes?: number; // Nueva propiedad
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

const getExtensionMinutes = (cita: Cita) => cita.extension_minutes || 0;

const getWindowTimes = (cita: Cita) => {
  const appointmentDateTime = getAppointmentDateTime(cita);
  if (!appointmentDateTime) return null;

  const extension = getExtensionMinutes(cita);
  
  // Abre: 10 minutos antes
  const openTime = new Date(appointmentDateTime.getTime() - 10 * 60 * 1000);
  
  // Cierra: 20 min duración + 20 min buffer + extensión
  const totalDuration = 40 + extension;
  const closeTime = new Date(appointmentDateTime.getTime() + totalDuration * 60 * 1000);

  return { openTime, closeTime };
};

const hasAppointmentPassed = (cita: Cita) => {
  const times = getWindowTimes(cita);
  if (!times) return false;
  
  // Consideramos pasada visualmente si ya cerro la ventana base (sin extension)
  // O podemos considerar si cerró la ventana extendida. 
  // Para "Auto-Finalizada" visual, mejor usar la ventana REAL extendida.
  return new Date() > times.closeTime;
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
      return "bg-green-50 text-green-700 border-green-200";
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

  const ADMIN_UID = '6278a2a5-e099-4a3f-81dc-920590863372';

  // Admin siempre puede entrar (por rol O por UID)
  if (currentProfile.role === "admin" || currentProfile.id === ADMIN_UID) return true;
  
  const isParticipant =
    cita.patient_id === currentProfile.id ||
    cita.psychologist_id === currentProfile.id;

  if (!isParticipant || cita.status !== "confirmed") return false;

  // Si es psicólogo, permitimos entrar siempre a confirmadas para dar soporte/extender
  if (currentProfile.role === "psychologist") return true;

  const times = getWindowTimes(cita);
  if (!times) return false;

  const now = new Date();
  return now >= times.openTime && now <= times.closeTime;
};

const getRemainingTimeMsg = (cita: Cita) => {
  const times = getWindowTimes(cita);
  if (!times) return null;
  
  const now = new Date();
  const diffMs = times.closeTime.getTime() - now.getTime();
  const diffMins = Math.ceil(diffMs / (1000 * 60));

  if (diffMins <= 10 && diffMins > 0) {
    return { type: 'warning', text: `Cierra en ${diffMins} min` };
  }
  if (diffMins <= 0) {
    return { type: 'expired', text: 'Tiempo agotado' };
  }
  return null;
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
  onExtendCita?: (id: string) => void; // Nueva prop opcional
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
  onExtendCita,
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
        const warning = getRemainingTimeMsg(cita);

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
                  
                  {/* Warning de tiempo solo si está confirmada y activa */}
                  {cita.status === "confirmed" && warning && warning.type === 'warning' && (
                     <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 animate-pulse">
                       {warning.text}
                     </span>
                  )}
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
                  {/* Mostrar extensión si existe */}
                  {getExtensionMinutes(cita) > 0 && (
                     <p className="text-xs text-green-600 font-medium">
                       + {getExtensionMinutes(cita)} min extra
                     </p>
                  )}
                </div>
              </div>
              
              {/* Botones de Acción */}
              <div className="flex flex-col gap-2 items-end self-center sm:self-end">
                {(() => {
                  const buttons = [];

                  // --- Lógica para Psicólogo ---
                  if (isPsychologist) {
                    // 1. Acciones de Cita Pendiente
                    if (cita.status === "pending" && !isPassed) {
                      buttons.push(
                        <div key="pending-actions" className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateCitaStatus(cita.id, "confirmed"); }}
                            className="px-3 py-1 text-xs text-white rounded-md transition"
                            style={{ backgroundColor: "var(--color-secondary)" }}
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); onUpdateCitaStatus(cita.id, "cancelled"); }}
                            className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                          >
                            Rechazar
                          </button>
                        </div>
                      );
                    }

                    // 2. Acciones de Cita Confirmada (Futura)
                    if (cita.status === "confirmed" && !isPassed) {
                      buttons.push(
                        <div key="confirmed-actions" className="flex gap-2">
                          {onExtendCita && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onExtendCita(cita.id); }}
                              className="px-3 py-1 text-xs text-secondary border border-secondary rounded-md hover:bg-purple-50 transition"
                            >
                              Extender (+10m)
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenFeedbackModal(cita.id); }}
                            className="px-3 py-1 text-xs text-white rounded-md transition"
                            style={{ backgroundColor: "var(--color-secondary)" }}
                          >
                            Finalizar cita
                          </button>
                        </div>
                      );
                    }

                    // 3. Acciones de Cita Terminada (Finalizada o Confirmada-Pasada)
                    const isEffectivelyFinalized = cita.status === "finalizada" || cita.status === "completed" || (cita.status === "confirmed" && isPassed);
                    if (isEffectivelyFinalized) {
                      buttons.push(
                        <div key="finalized-actions" className="flex flex-col gap-2 items-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); onOpenFeedbackModal(cita.id); }}
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

                    // 4. Acción de ELIMINAR (Para cualquier estado que permita limpiar la lista)
                    // Permitimos eliminar si está Cancelada, si expiró sin aceptarse, o si YA fue finalizada
                    const canDelete = cita.status === "cancelled" || (cita.status === "pending" && isPassed) || cita.status === "finalizada" || cita.status === "completed";
                    if (canDelete) {
                      buttons.push(
                        <button
                          key="delete-action"
                          onClick={(e) => { e.stopPropagation(); onDeleteCita(cita.id); }}
                          className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Eliminar
                        </button>
                      );
                    }
                  }

                  // --- Lógica para Admin ---
                  const ADMIN_UID = '6278a2a5-e099-4a3f-81dc-920590863372';
                  const isSuperAdmin = isAdmin || currentProfile?.id === ADMIN_UID;

                  if (isSuperAdmin) {
                    buttons.push(
                      <button
                        key="admin-delete"
                        onClick={(e) => { e.stopPropagation(); onDeleteCita(cita.id); }}
                        className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                      >
                        Eliminar
                      </button>
                    );
                  }

                  // --- Lógica para Paciente ---
                  if (isPatient) {
                    if (cita.status === "pending" && !isPassed) {
                      buttons.push(
                        <button
                          key="patient-cancel"
                          onClick={(e) => { e.stopPropagation(); onCancelCita(cita.id); }}
                          className="px-3 py-1 text-xs text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition"
                        >
                          Cancelar
                        </button>
                      );
                    }
                  }

                  return buttons;
                })()}

                {/* Botón de Chat (Común) - Solo mostrar si NO está activo */}
                {canJoinAppointment(cita, currentProfile) && !isActive && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChat(cita.id);
                    }}
                    className="px-3 py-1 text-xs text-white rounded-md transition hover:opacity-90 bg-accent"
                  >
                    Ir al Chat
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
