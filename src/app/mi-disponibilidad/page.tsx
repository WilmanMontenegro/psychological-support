'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/auth';
import toast from 'react-hot-toast';

type TimeSlot = {
  id?: string;
  time_slot: number;
  start_time: string;
  end_time: string;
};

type DayAvailability = {
  day_of_week: number;
  is_available: boolean;
  slots: TimeSlot[];
};

const DAYS = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
];

export default function MiDisponibilidadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<DayAvailability[]>([]);

  useEffect(() => {
    checkUserAndLoadAvailability();
  }, []);

  const checkUserAndLoadAvailability = async () => {
    const profile = await getUserProfile();

    if (!profile) {
      router.push('/login');
      return;
    }

    if (profile.role !== 'psychologist' && profile.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/');
      return;
    }

    await loadAvailability(profile.id);
    setLoading(false);
  };

  const loadAvailability = async (psychologistId: string) => {
    try {
      const { data, error } = await supabase
        .from('psychologist_availability')
        .select('*')
        .eq('psychologist_id', psychologistId)
        .order('day_of_week')
        .order('time_slot');

      if (error) throw error;

      // Agrupar por día
      const grouped: DayAvailability[] = DAYS.map(day => {
        const daySlots = (data || []).filter(item => item.day_of_week === day.value);

        return {
          day_of_week: day.value,
          is_available: daySlots.length > 0,
          slots: daySlots.length > 0
            ? daySlots.map(slot => ({
                id: slot.id,
                time_slot: slot.time_slot || 1,
                start_time: slot.start_time,
                end_time: slot.end_time,
              }))
            : [{ time_slot: 1, start_time: '09:00', end_time: '17:00' }]
        };
      });

      setAvailability(grouped);
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      toast.error('Error al cargar la disponibilidad');
    }
  };

  const handleToggleDay = (dayOfWeek: number) => {
    setAvailability(prev =>
      prev.map(day =>
        day.day_of_week === dayOfWeek
          ? {
              ...day,
              is_available: !day.is_available,
              slots: !day.is_available
                ? [{ time_slot: 1, start_time: '09:00', end_time: '17:00' }]
                : day.slots
            }
          : day
      )
    );
  };

  const handleTimeChange = (dayOfWeek: number, slotIndex: number, field: 'start_time' | 'end_time', value: string) => {
    setAvailability(prev =>
      prev.map(day =>
        day.day_of_week === dayOfWeek
          ? {
              ...day,
              slots: day.slots.map((slot, idx) =>
                idx === slotIndex ? { ...slot, [field]: value } : slot
              )
            }
          : day
      )
    );
  };

  const handleAddSlot = (dayOfWeek: number) => {
    setAvailability(prev =>
      prev.map(day =>
        day.day_of_week === dayOfWeek && day.slots.length < 2
          ? {
              ...day,
              slots: [...day.slots, { time_slot: day.slots.length + 1, start_time: '14:00', end_time: '18:00' }]
            }
          : day
      )
    );
  };

  const handleRemoveSlot = (dayOfWeek: number, slotIndex: number) => {
    setAvailability(prev =>
      prev.map(day =>
        day.day_of_week === dayOfWeek
          ? {
              ...day,
              slots: day.slots.filter((_, idx) => idx !== slotIndex).map((slot, idx) => ({
                ...slot,
                time_slot: idx + 1
              }))
            }
          : day
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const profile = await getUserProfile();
      if (!profile) throw new Error('No autenticado');

      // Eliminar disponibilidad anterior
      await supabase
        .from('psychologist_availability')
        .delete()
        .eq('psychologist_id', profile.id);

      // Preparar datos para insertar
      const availableData = availability
        .filter(day => day.is_available && day.slots.length > 0)
        .flatMap(day =>
          day.slots.map((slot, idx) => ({
            psychologist_id: profile.id,
            day_of_week: day.day_of_week,
            time_slot: idx + 1,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_available: true,
          }))
        );

      if (availableData.length > 0) {
        const { error } = await supabase
          .from('psychologist_availability')
          .insert(availableData);

        if (error) throw error;
      }

      toast.success('Disponibilidad actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      toast.error('Error al guardar la disponibilidad');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            Mi Disponibilidad
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600">
            Configura tus horarios de atención (máximo 2 rangos por día)
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4">
          {DAYS.map(day => {
            const dayData = availability.find(d => d.day_of_week === day.value) || {
              day_of_week: day.value,
              is_available: false,
              slots: [{ time_slot: 1, start_time: '09:00', end_time: '17:00' }],
            };

            return (
              <div
                key={day.value}
                className="p-4 border border-gray-200 rounded-lg"
              >
                {/* Día y checkbox */}
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={dayData.is_available}
                    onChange={() => handleToggleDay(day.value)}
                    className="w-5 h-5"
                    style={{ accentColor: 'var(--color-secondary)' }}
                  />
                  <span className="font-medium text-gray-700">{day.label}</span>
                </div>

                {/* Horarios */}
                {dayData.is_available && (
                  <div className="ml-8">
                    <div className="flex flex-wrap items-center gap-3">
                      {dayData.slots.map((slot, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="time"
                            value={slot.start_time}
                            onChange={e => handleTimeChange(day.value, idx, 'start_time', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                          <span className="text-gray-500">a</span>
                          <input
                            type="time"
                            value={slot.end_time}
                            onChange={e => handleTimeChange(day.value, idx, 'end_time', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                          />

                          {/* Botón eliminar rango */}
                          {dayData.slots.length > 1 && (
                            <button
                              onClick={() => handleRemoveSlot(day.value, idx)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition"
                              aria-label="Eliminar rango"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}

                      {/* Botón agregar rango */}
                      {dayData.slots.length < 2 && (
                        <button
                          onClick={() => handleAddSlot(day.value)}
                          className="text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition"
                          style={{ color: 'var(--color-secondary)' }}
                        >
                          + Agregar otro rango horario
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Botón guardar */}
          <div className="pt-4 text-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 text-white font-medium rounded-md transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              {saving ? 'Guardando...' : 'Guardar Disponibilidad'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}