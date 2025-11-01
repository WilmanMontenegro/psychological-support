-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Función utilitaria para actualizar columnas updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Tabla de perfiles enlazada con auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('admin', 'psychologist', 'patient')),
  birthdate DATE,
  gender TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access to profiles"
ON public.profiles
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para sincronizar metadata de auth.users con profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_role TEXT := COALESCE(NULLIF(NEW.raw_user_meta_data->>'role', ''), 'patient');
BEGIN
  INSERT INTO public.profiles (id, full_name, role, birthdate, gender, phone)
  VALUES (
    NEW.id,
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    v_role,
    NULLIF(NEW.raw_user_meta_data->>'birthdate', '')::DATE,
    NULLIF(NEW.raw_user_meta_data->>'gender', ''),
    NULLIF(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    birthdate = EXCLUDED.birthdate,
    gender = EXCLUDED.gender,
    phone = EXCLUDED.phone,
    role = CASE
      WHEN EXCLUDED.role IS NOT NULL THEN EXCLUDED.role
      ELSE public.profiles.role
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_handle_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Tabla de citas
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  psychologist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  problem_type TEXT NOT NULL CHECK (problem_type IN ('couple', 'anxiety', 'emotions', 'unknown')),
  modality TEXT NOT NULL CHECK (modality IN ('video', 'chat')),
  preferred_date DATE NOT NULL,
  preferred_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_psychologist ON public.appointments(psychologist_id);
CREATE INDEX idx_appointments_status ON public.appointments(status);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients can manage own appointments"
ON public.appointments
FOR ALL
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Psychologists can view assigned appointments"
ON public.appointments
FOR SELECT
USING (auth.uid() = psychologist_id);

CREATE POLICY "Admins can manage all appointments"
ON public.appointments
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  )
);

CREATE POLICY "Service role full access to appointments"
ON public.appointments
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Psychologists can update assigned appointments"
ON public.appointments
FOR UPDATE
USING (auth.uid() = psychologist_id)
WITH CHECK (auth.uid() = psychologist_id);

CREATE TRIGGER trg_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Función RPC para eliminar la cuenta del usuario autenticado
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Operación no permitida: usuario no autenticado.';
  END IF;

  -- Eliminar definitivamente al usuario (cascada elimina perfiles y citas)
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.delete_user() TO authenticated;
