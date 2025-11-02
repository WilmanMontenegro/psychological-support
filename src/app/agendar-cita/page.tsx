'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type ProblemType = 'couple' | 'anxiety' | 'emotions' | 'unknown';
type Modality = 'video' | 'chat';

type AvailabilitySlot = {
  start_time: string;
  end_time: string;
};

type AvailabilityByDay = Record<number, AvailabilitySlot[]>;

type DateOption = {
  value: string;
  label: string;
};

type SchedulingWindow = {
  earliest: Date;
  latest: Date;
};

const APPOINTMENT_DURATION_MINUTES = 20;
const MIN_HOURS_NOTICE = 24;
const MAX_DAYS_RANGE = 7;
const DEFAULT_COMPANION_LABEL = 'Ana Marcela Polo Bastidas';

const formatDateValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const capitalize = (text: string) => (text ? text.charAt(0).toUpperCase() + text.slice(1) : text);

const parseTimeToMinutes = (time: string) => {
  if (!time) return 0;
  const [hour = '0', minute = '0'] = time.split(':');
  return Number(hour) * 60 + Number(minute);
};

const formatMinutesToTime = (minutesTotal: number) => {
  const hours = Math.floor(minutesTotal / 60)
    .toString()
    .padStart(2, '0');
  const minutes = (minutesTotal % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const formatTimeLabel = (time24h: string) => {
  const [hourStr = '00', minuteStr = '00'] = time24h.split(':');
  const hourNum = Number(hourStr);
  const suffix = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
  return `${hour12.toString().padStart(2, '0')}:${minuteStr} ${suffix}`;
};

const getSchedulingWindow = () => {
  const now = new Date();
  const earliest = new Date(now.getTime() + MIN_HOURS_NOTICE * 60 * 60 * 1000);
  const latest = new Date(now.getTime() + MAX_DAYS_RANGE * 24 * 60 * 60 * 1000);
  return { earliest, latest };
};

const isWithinSchedulingWindow = (
  dateValue: string,
  timeValue: string,
  earliest: Date,
  latest: Date
) => {
  if (!dateValue || !timeValue) return false;
  const candidate = new Date(`${dateValue}T${timeValue}`);
  if (Number.isNaN(candidate.getTime())) return false;
  return candidate >= earliest && candidate <= latest;
};

const filterTimesWithinWindow = (
  dateValue: string,
  times: string[],
  earliest: Date,
  latest: Date
) => times.filter(time => isWithinSchedulingWindow(dateValue, time, earliest, latest));

const generateTimesFromSlots = (
  slots: AvailabilitySlot[],
  intervalMinutes = APPOINTMENT_DURATION_MINUTES
) => {
  const times = new Set<string>();

  slots.forEach(slot => {
    const startMinutes = parseTimeToMinutes(slot.start_time);
    const endMinutes = parseTimeToMinutes(slot.end_time);

    for (let current = startMinutes; current + intervalMinutes <= endMinutes; current += intervalMinutes) {
      times.add(formatMinutesToTime(current));
    }
  });

  return Array.from(times).sort();
};

const generateDateOptionsForAvailability = (
  availability: AvailabilityByDay,
  window?: SchedulingWindow
): DateOption[] => {
  const options: DateOption[] = [];
  const today = new Date();
  const { earliest, latest } = window ?? getSchedulingWindow();

  for (let offset = 0; offset <= MAX_DAYS_RANGE; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const value = formatDateValue(date);
    const dayOfWeek = date.getDay();
    const slots = availability[dayOfWeek];

    if (!slots || slots.length === 0) continue;

    const availableTimes = generateTimesFromSlots(slots);
    const validTimes = filterTimesWithinWindow(value, availableTimes, earliest, latest);
    if (validTimes.length === 0) continue;

    const label = capitalize(
      date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
    );

    options.push({ value, label });
  }

  return options;
};

const generateTimeOptionsForDate = (
  availability: AvailabilityByDay,
  date: string,
  window?: SchedulingWindow
) => {
  if (!date) return [];
  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return [];

  const dayOfWeek = parsedDate.getDay();
  const slots = availability[dayOfWeek] || [];

  const { earliest, latest } = window ?? getSchedulingWindow();

  return filterTimesWithinWindow(
    date,
    generateTimesFromSlots(slots),
    earliest,
    latest
  ).map(time => ({
    value: time,
    label: formatTimeLabel(time),
  }));
};

export default function AgendarCitaPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, AvailabilityByDay>>({});
  const [psychologists, setPsychologists] = useState<Array<{ id: string; label: string }>>([]);
  const [dateOptions, setDateOptions] = useState<DateOption[]>([]);
  const [timeOptions, setTimeOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    isAnonymous: false,
    problemType: '' as ProblemType | '',
    modality: '' as Modality | '',
    date: '',
    time: '',
    psychologistId: ''
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    await loadAvailability();
    setLoading(false);
  };

  const loadAvailability = async () => {
    try {
      const schedulingWindow = getSchedulingWindow();

      const { data, error } = await supabase
        .from('psychologist_availability')
        .select('psychologist_id, day_of_week, start_time, end_time, time_slot, is_available')
        .eq('is_available', true);

      if (error) throw error;

      if (!data || data.length === 0) {
        setAvailabilityMap({});
        setPsychologists([]);
        setDateOptions([]);
        setTimeOptions([]);
        setFormData(prev => ({ ...prev, psychologistId: '', date: '', time: '' }));
        setAvailabilityError('Por ahora no hay disponibilidad publicada. Intenta nuevamente más tarde.');
        return;
      }

      const grouped: Record<string, AvailabilityByDay> = {};

      data.forEach(item => {
        const { psychologist_id, day_of_week, start_time, end_time } = item;
        if (!grouped[psychologist_id]) {
          grouped[psychologist_id] = {};
        }
        if (!grouped[psychologist_id][day_of_week]) {
          grouped[psychologist_id][day_of_week] = [];
        }
        grouped[psychologist_id][day_of_week].push({
          start_time,
          end_time,
        });
      });

      Object.values(grouped).forEach(byDay => {
        Object.values(byDay).forEach(slots => {
          slots.sort((a, b) => a.start_time.localeCompare(b.start_time));
        });
      });

      const psychologistIds = Object.keys(grouped);
      const psychologistList = psychologistIds.map((id, index) => ({
        id,
        label: psychologistIds.length === 1 ? DEFAULT_COMPANION_LABEL : `Acompañante ${index + 1}`,
      }));

      setAvailabilityMap(grouped);
      setPsychologists(psychologistList);
      setAvailabilityError(null);

      const initialPsychologist =
        (formData.psychologistId && grouped[formData.psychologistId] ? formData.psychologistId : null) ||
        psychologistList[0]?.id ||
        '';

      if (!initialPsychologist) {
        setDateOptions([]);
        setTimeOptions([]);
        setFormData(prev => ({ ...prev, psychologistId: '', date: '', time: '' }));
        setAvailabilityError('Por ahora no hay disponibilidad publicada. Intenta nuevamente más tarde.');
        return;
      }

      const initialDates = generateDateOptionsForAvailability(
        grouped[initialPsychologist],
        schedulingWindow
      );
      setDateOptions(initialDates);

      if (initialDates.length === 0) {
        setTimeOptions([]);
        setFormData(prev => ({
          ...prev,
          psychologistId: initialPsychologist,
          date: '',
          time: ''
        }));
        setAvailabilityError('Por ahora no hay horarios disponibles dentro de la próxima semana.');
        return;
      }

      const chosenDate =
        formData.date && initialDates.some(option => option.value === formData.date)
          ? formData.date
          : initialDates[0]?.value || '';

      const initialTimes = chosenDate
        ? generateTimeOptionsForDate(grouped[initialPsychologist], chosenDate, schedulingWindow)
        : [];
      setTimeOptions(initialTimes);

      if (initialTimes.length === 0) {
        setTimeOptions([]);
        setFormData(prev => ({
          ...prev,
          psychologistId: initialPsychologist,
          date: chosenDate,
          time: ''
        }));
        setAvailabilityError('Por ahora no hay horarios disponibles dentro de la próxima semana.');
        return;
      }

      const chosenTime =
        formData.time && initialTimes.some(option => option.value === formData.time)
          ? formData.time
          : initialTimes[0]?.value ?? '';

      setFormData(prev => ({
        ...prev,
        psychologistId: initialPsychologist,
        date: chosenDate,
        time: chosenTime
      }));
      setAvailabilityError(null);
    } catch (error) {
      console.error('Error al cargar disponibilidad:', error);
      setAvailabilityError('No se pudo cargar la disponibilidad. Intenta nuevamente más tarde.');
    }
  };

  const updateSelectionsForPsychologist = (psychologistId: string) => {
    if (!psychologistId) {
      setDateOptions([]);
      setTimeOptions([]);
      setFormData(prev => ({ ...prev, psychologistId: '', date: '', time: '' }));
      return;
    }

    const availability = availabilityMap[psychologistId];

    if (!availability) {
      setDateOptions([]);
      setTimeOptions([]);
      setFormData(prev => ({ ...prev, psychologistId, date: '', time: '' }));
      return;
    }

    const schedulingWindow = getSchedulingWindow();

    const dates = generateDateOptionsForAvailability(availability, schedulingWindow);
    setDateOptions(dates);

    const selectedDate =
      formData.date && dates.some(option => option.value === formData.date)
        ? formData.date
        : dates[0]?.value || '';

    if (dates.length === 0) {
      setTimeOptions([]);
      setFormData(prev => ({ ...prev, psychologistId, date: '', time: '' }));
      setAvailabilityError('Por ahora no hay horarios disponibles dentro de la próxima semana.');
      return;
    }

    const times = selectedDate
      ? generateTimeOptionsForDate(availability, selectedDate, schedulingWindow)
      : [];
    setTimeOptions(times);

    const selectedTime =
      formData.time && times.some(option => option.value === formData.time)
        ? formData.time
        : times[0]?.value ?? '';

    setFormData(prev => ({
      ...prev,
      psychologistId,
      date: selectedDate,
      time: selectedTime
    }));
    setAvailabilityError(null);
  };

  const updateTimesForDate = (dateValue: string) => {
    const availability = availabilityMap[formData.psychologistId];

    if (!availability) {
      setTimeOptions([]);
      setFormData(prev => ({ ...prev, date: dateValue, time: '' }));
      return;
    }

    const schedulingWindow = getSchedulingWindow();
    const times = generateTimeOptionsForDate(availability, dateValue, schedulingWindow);
    setTimeOptions(times);

    if (times.length === 0) {
      setFormData(prev => ({ ...prev, date: dateValue, time: '' }));
      setAvailabilityError('No hay horarios disponibles para la fecha seleccionada.');
      return;
    }

    const selectedTime = times.some(option => option.value === formData.time)
      ? formData.time
      : times[0]?.value ?? '';

    setFormData(prev => ({
      ...prev,
      date: dateValue,
      time: selectedTime
    }));
    setAvailabilityError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setFormData({
        ...formData,
        isAnonymous: value === 'anonymous'
      });
      return;
    }

    if (name === 'psychologistId') {
      updateSelectionsForPsychologist(value);
      return;
    }

    if (name === 'date') {
      updateTimesForDate(value);
      return;
    }

    if (name === 'time') {
      setFormData(prev => ({
        ...prev,
        time: value
      }));
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.psychologistId || !formData.date || !formData.time) {
      toast.error('Selecciona un horario disponible antes de agendar.');
      return;
    }

    const schedulingWindow = getSchedulingWindow();
    if (
      !isWithinSchedulingWindow(
        formData.date,
        formData.time,
        schedulingWindow.earliest,
        schedulingWindow.latest
      )
    ) {
      toast.error('Las citas deben agendarse con al menos 24 horas de anticipación y dentro de la próxima semana.');
      return;
    }

    setSubmitting(true);

    const loadingToast = toast.loading('Agendando tu cita...');

    try {
      // Guardar la cita en la base de datos
      const { error: insertError } = await supabase
        .from('appointments')
        .insert({
          patient_id: user.id,
          psychologist_id: formData.psychologistId,
          is_anonymous: formData.isAnonymous,
          problem_type: formData.problemType,
          modality: formData.modality,
          preferred_date: formData.date,
          preferred_time: formData.time,
          status: 'pending'
        });

      if (insertError) throw insertError;

      toast.dismiss(loadingToast);
      toast.success('¡Cita agendada exitosamente! Te contactaremos pronto');

      setSuccess(true);

      // Redirigir a mis citas después de 2 segundos
      setTimeout(() => {
        router.push('/mis-citas');
      }, 2000);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Error al agendar la cita. Por favor intenta nuevamente');
      console.error('Error al agendar cita:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--color-secondary)' }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-libre-baskerville text-accent mb-2">¡Cita Agendada!</h2>
          <p className="text-gray-600">Te contactaremos pronto para confirmar tu cita.</p>
        </div>
      </div>
    );
  }

  const schedulingWindowForRender = getSchedulingWindow();
  const selectionWithinWindow = isWithinSchedulingWindow(
    formData.date,
    formData.time,
    schedulingWindowForRender.earliest,
    schedulingWindowForRender.latest
  );

  const canSubmit = Boolean(
    formData.problemType &&
    formData.modality &&
    formData.date &&
    formData.time &&
    formData.psychologistId &&
    timeOptions.length > 0 &&
    selectionWithinWindow
  );

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            Agendar Cita
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Duración de la consulta:</strong> 20 minutos
            </p>
            <p className="text-sm text-blue-800 mt-2">
              Recuerda que puedes agendar con mínimo 24 horas de anticipación y hasta 7 días después de la fecha actual.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-6">
          {availabilityError && (
            <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              {availabilityError}
            </div>
          )}

          <div>
            <label htmlFor="psychologistId" className="block text-sm font-medium text-gray-700 mb-1">
              Acompañante
            </label>
            {psychologists.length > 1 ? (
              <select
                id="psychologistId"
                name="psychologistId"
                value={formData.psychologistId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                {psychologists.map(psychologist => (
                  <option key={psychologist.id} value={psychologist.id}>
                    {psychologist.label}
                  </option>
                ))}
              </select>
            ) : psychologists.length === 1 ? (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-700">
                {psychologists[0].label}
              </div>
            ) : (
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-500">
                No hay acompañantes con disponibilidad activa.
              </div>
            )}
          </div>

          {/* Modo de Consulta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modo de Consulta
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultMode"
                  value="normal"
                  checked={!formData.isAnonymous}
                  onChange={handleChange}
                  className="mr-2"
                  style={{ accentColor: 'var(--color-secondary)' }}
                />
                <span>Normal</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="consultMode"
                  value="anonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="mr-2"
                  style={{ accentColor: 'var(--color-secondary)' }}
                />
                <span>Anónimo</span>
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formData.isAnonymous
                ? 'Tu identidad será completamente anónima en esta consulta'
                : 'Usaremos la información de tu perfil para esta consulta'}
            </p>
          </div>

          {/* Tipo de Problema */}
          <div>
            <label htmlFor="problemType" className="block text-sm font-medium text-gray-700 mb-1">
              ¿Qué tipo de apoyo buscas?
            </label>
            <select
              id="problemType"
              name="problemType"
              required
              value={formData.problemType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona una opción</option>
              <option value="couple">Problemas de Pareja</option>
              <option value="anxiety">Ansiedad</option>
              <option value="emotions">Manejo de Emociones</option>
              <option value="unknown">No sé qué tengo</option>
            </select>
          </div>

          {/* Tipo de Sesión */}
          <div>
            <label htmlFor="modality" className="block text-sm font-medium text-gray-700 mb-1">
              Modalidad de la Cita
            </label>
            <select
              id="modality"
              name="modality"
              required
              value={formData.modality}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
            >
              <option value="">Selecciona una opción</option>
              <option value="video">Videollamada</option>
              <option value="chat">Chat</option>
            </select>
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha
              </label>
              <select
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={dateOptions.length === 0}
              >
                {dateOptions.length === 0 ? (
                  <option value="">Sin fechas disponibles</option>
                ) : (
                  dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Hora
              </label>
              <select
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                disabled={timeOptions.length === 0}
              >
                {timeOptions.length === 0 ? (
                  <option value="">Sin horarios disponibles</option>
                ) : (
                  timeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                )}
              </select>
              {timeOptions.length === 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  Elige otra fecha o profesional para ver horarios disponibles.
                </p>
              )}
            </div>
          </div>

          {/* Botón de envío */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || !canSubmit}
              className="w-full py-3 px-4 text-white font-medium rounded-md transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              {submitting ? 'Agendando...' : 'Agendar Cita'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
