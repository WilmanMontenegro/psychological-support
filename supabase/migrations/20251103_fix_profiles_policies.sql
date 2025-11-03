-- Fix: evitar recursión infinita en políticas de profiles
-- Contexto: La política "Admins can view all profiles" consultaba la misma tabla `profiles`
-- dentro de la expresión USING, lo que produce recursión infinita en Postgres.

-- 1) Función auxiliar para verificar si el usuario es admin
--    Se usa en la política para eliminar la consulta directa a `profiles` en la expresión.
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = uid
      AND p.role = 'admin'
  );
$$;

-- 2) Reemplazar la política de admins para evitar recursión
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'profiles'
      AND policyname = 'Admins can view all profiles'
  ) THEN
    EXECUTE 'DROP POLICY "Admins can view all profiles" ON public.profiles';
  END IF;
END$$;

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- 3) Asegurar políticas esenciales (idempotentes) sin recursión
--    Permitir ver su propio perfil
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id)$$;
  END IF;
END$$;

--    Permitir insertar/actualizar su propio perfil (por si faltan en entornos nuevos)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)$$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    EXECUTE $$CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)$$;
  END IF;
END$$;

-- Nota: Las otras políticas de lectura ya existentes para psicólogos y usuarios autenticados
-- (definidas en 202410151205_update_profiles_policies.sql) se mantienen sin cambios.
