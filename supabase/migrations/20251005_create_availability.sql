-- Crear tabla de disponibilidad de psicólogos
CREATE TABLE psychologist_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Evitar duplicados de día para el mismo psicólogo
  UNIQUE(psychologist_id, day_of_week)
);

-- Habilitar RLS
ALTER TABLE psychologist_availability ENABLE ROW LEVEL SECURITY;

-- Política: Los psicólogos pueden ver su propia disponibilidad
CREATE POLICY "Psychologists can view own availability"
  ON psychologist_availability FOR SELECT
  USING (auth.uid() = psychologist_id);

-- Política: Los psicólogos pueden gestionar su disponibilidad
CREATE POLICY "Psychologists can manage own availability"
  ON psychologist_availability FOR ALL
  USING (auth.uid() = psychologist_id);

-- Política: Los admins pueden ver toda la disponibilidad
CREATE POLICY "Admins can view all availability"
  ON psychologist_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Política: Los pacientes pueden ver disponibilidad de psicólogos
CREATE POLICY "Patients can view psychologist availability"
  ON psychologist_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = psychologist_availability.psychologist_id
      AND profiles.role = 'psychologist'
    )
  );

-- Trigger para actualizar updated_at
CREATE TRIGGER update_availability_updated_at
  BEFORE UPDATE ON psychologist_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Crear índices
CREATE INDEX idx_availability_psychologist ON psychologist_availability(psychologist_id);
CREATE INDEX idx_availability_day ON psychologist_availability(day_of_week);
CREATE INDEX idx_availability_psychologist_day ON psychologist_availability(psychologist_id, day_of_week);