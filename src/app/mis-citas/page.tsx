"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getUserProfile, type UserProfile } from "@/lib/auth";
import Link from "next/link";
import toast from "react-hot-toast";
import AppointmentChat from "@/components/AppointmentChat";
import AppointmentList, { type Cita } from "@/components/AppointmentList";

export default function MisCitasPage() {
  const router = useRouter();
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(
    null,
  );
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);
  const [activeChatAppointmentId, setActiveChatAppointmentId] = useState<
    string | null
  >(null);
  const [feedbackModal, setFeedbackModal] = useState<{
    open: boolean;
    citaId: string | null;
  }>({ open: false, citaId: null });
  const [feedbackText, setFeedbackText] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);

  const loadCitas = useCallback(async (profile: UserProfile) => {
    try {
      const baseSelect =
        profile.role === "admin"
          ? `*, patient:profiles!appointments_patient_id_fkey(full_name, phone), psychologist:profiles!appointments_psychologist_id_fkey(full_name, phone)`
          : profile.role === "psychologist"
            ? `*, patient:profiles!appointments_patient_id_fkey(full_name, phone)`
            : `*, psychologist:profiles!appointments_psychologist_id_fkey(full_name)`;

      let query = supabase
        .from("appointments")
        .select(baseSelect.trim())
        .order("preferred_date", { ascending: false });

      if (profile.role === "patient") {
        query = query.eq("patient_id", profile.id);
      } else if (profile.role === "psychologist") {
        query = query.eq("psychologist_id", profile.id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCitas((data as unknown as Cita[]) || []);
    } catch (error: unknown) {
      console.error("Error al cargar citas:", error);
      toast.error("Error al cargar tus citas");
    }
  }, []);

  const checkUserAndLoadCitas = useCallback(async () => {
    try {
      const profile = await getUserProfile();
      if (!profile) {
        router.push("/login");
        return;
      }
      setCurrentProfile(profile);
      await loadCitas(profile);
    } catch (error: unknown) {
      console.error("Error al verificar usuario:", error);
      toast.error(
        "No se pudo cargar la información de tu cuenta. Intenta nuevamente.",
      );
      router.push("/login");
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

  const reloadCitas = useCallback(async () => {
    if (currentProfile) {
      await loadCitas(currentProfile);
    }
  }, [currentProfile, loadCitas]);

  const cancelarCita = async (citaId: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;
    if (!currentProfile) {
      toast.error(
        "No se pudo validar tu sesión. Intenta iniciar sesión nuevamente.",
      );
      return;
    }
    try {
      let query = supabase
        .from("appointments")
        .update({ status: "cancelled" })
        .eq("id", citaId);
      if (currentProfile.role === "patient")
        query = query.eq("patient_id", currentProfile.id);
      else if (currentProfile.role === "psychologist")
        query = query.eq("psychologist_id", currentProfile.id);

      const { error } = await query;
      if (error) throw error;
      toast.success("Cita cancelada exitosamente");
      await reloadCitas();
      if (activeChatAppointmentId === citaId) setActiveChatAppointmentId(null);
    } catch (error: unknown) {
      console.error("Error al cancelar cita:", error);
      const message =
        error instanceof Error ? error.message : "Error al cancelar la cita";
      toast.error(message);
    }
  };

  const actualizarEstadoCita = async (
    citaId: string,
    nuevoEstado: Cita["status"],
  ) => {
    try {
      if (!currentProfile) {
        toast.error(
          "No se pudo validar tu sesión. Intenta iniciar sesión nuevamente.",
        );
        return;
      }
      const { error } = await supabase
        .from("appointments")
        .update({ status: nuevoEstado })
        .eq("id", citaId);
      if (error) throw error;
      await reloadCitas();
      const successMessage =
        nuevoEstado === "confirmed"
          ? "Cita confirmada exitosamente"
          : "Cita actualizada";
      toast.success(successMessage);
      if (nuevoEstado !== "confirmed" && activeChatAppointmentId === citaId)
        setActiveChatAppointmentId(null);
    } catch (error: unknown) {
      console.error("Error al actualizar la cita:", error);
      const message =
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado de la cita";
      toast.error(message);
    }
  };

  const marcarComoCompletada = async () => {
    if (!feedbackModal.citaId || !feedbackText.trim()) {
      toast.error("Por favor escribe una retroalimentación");
      return;
    }
    setSavingFeedback(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .update({
          status: "finalizada",
          psychologist_feedback: feedbackText,
          completed_at: new Date().toISOString(),
        })
        .eq("id", feedbackModal.citaId);
      if (error) throw error;
      toast.success("Cita finalizada exitosamente");
      setFeedbackModal({ open: false, citaId: null });
      setFeedbackText("");
      await reloadCitas();
    } catch (error: unknown) {
      console.error("Error al marcar cita como completada:", error);
      const message =
        error instanceof Error ? error.message : "Error al finalizar la cita";
      toast.error(message);
    } finally {
      setSavingFeedback(false);
    }
  };

  const eliminarCita = async (citaId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta cita?")) return;
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", citaId);
      if (error) throw error;
      toast.success("Cita eliminada");
      await reloadCitas();
    } catch (error: unknown) {
      console.error("Error al eliminar cita:", error);
      const message =
        error instanceof Error ? error.message : "Error al eliminar la cita";
      toast.error(message);
    }
  };

  const handleJoinAppointment = (citaId: string) => {
    setActiveChatAppointmentId(citaId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <p className="text-gray-600">Cargando tus citas...</p>
      </div>
    );
  }

  const isPatient = currentProfile?.role === "patient";
  const pageTitle =
    currentProfile?.role === "psychologist"
      ? "Citas Asignadas"
      : currentProfile?.role === "admin"
        ? "Todas las Citas"
        : "Mis Citas";
  const pageDescription =
    currentProfile?.role === "psychologist"
      ? "Revisa las citas que los pacientes han reservado contigo."
      : currentProfile?.role === "admin"
        ? "Consulta el estado de todas las citas agendadas en la plataforma."
        : "Aquí puedes ver y administrar todas tus citas agendadas";

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            {pageTitle}
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 mb-6">{pageDescription}</p>
          {isPatient && (
            <Link
              href="/agendar-cita"
              className="inline-block text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
              style={{ backgroundColor: "var(--color-secondary)" }}
            >
              Agendar Nueva Cita
            </Link>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna Izquierda: Lista de Citas (se oculta en móvil si hay un chat activo) */}
          <div
            className={`w-full md:w-1/3 lg:w-2/5 h-[80vh] overflow-y-auto pr-2 ${
              activeChatAppointmentId ? "hidden md:block" : "block"
            }`}
          >
            <AppointmentList
              citas={citas}
              currentProfile={currentProfile}
              activeChatAppointmentId={activeChatAppointmentId}
              onSelectChat={handleJoinAppointment}
              onCancelCita={cancelarCita}
              onUpdateCitaStatus={actualizarEstadoCita}
              onOpenFeedbackModal={(citaId) =>
                setFeedbackModal({ open: true, citaId })
              }
              onDeleteCita={eliminarCita}
            />
          </div>

          {/* Columna Derecha: Chat Activo (ocupa toda la pantalla en móvil si está activo) */}
          <div
            className={`w-full h-[80vh] ${
              activeChatAppointmentId ? "block" : "hidden md:block"
            } md:w-2/3 lg:w-3/5`}
          >
            {activeChatAppointmentId && currentProfile ? (
              <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
                <div className="flex items-center p-4 border-b border-gray-200">
                  <button
                    onClick={() => setActiveChatAppointmentId(null)}
                    className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-100"
                    aria-label="Volver a la lista"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <h4 className="text-lg font-semibold text-accent">
                    Mensajes de la Cita
                  </h4>
                </div>
                <AppointmentChat
                  appointmentId={activeChatAppointmentId}
                  userId={currentProfile.id}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md h-full flex-col items-center justify-center text-center p-6 hidden md:flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-300 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <h3 className="text-xl font-libre-baskerville text-accent">
                  Bienvenido a tus citas
                </h3>
                <p className="text-gray-500 mt-2">
                  Selecciona una cita de la lista para ver los mensajes o unirte
                  a la conversación.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 sm:p-8">
            <h3 className="text-xl font-libre-baskerville text-accent mb-2">
              Finalizar Cita
            </h3>
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
                  setFeedbackText("");
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
                style={{ backgroundColor: "var(--color-secondary)" }}
              >
                {savingFeedback ? "Guardando..." : "Finalizar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
