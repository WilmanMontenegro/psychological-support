-- Eliminar la restricción UNIQUE para permitir múltiples rangos por día
ALTER TABLE psychologist_availability
DROP CONSTRAINT IF EXISTS psychologist_availability_psychologist_id_day_of_week_key;

-- Agregar campo para identificar el rango (1 o 2)
ALTER TABLE psychologist_availability
ADD COLUMN IF NOT EXISTS time_slot INTEGER DEFAULT 1 CHECK (time_slot IN (1, 2));

-- Crear nueva restricción única que incluya time_slot
ALTER TABLE psychologist_availability
ADD CONSTRAINT unique_psychologist_day_slot
UNIQUE (psychologist_id, day_of_week, time_slot);