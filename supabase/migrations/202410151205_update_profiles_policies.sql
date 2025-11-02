-- Permitir que cualquier usuario autenticado pueda ver la información básica de los psicólogos
CREATE POLICY "Authenticated users can view psychologists"
ON public.profiles
FOR SELECT
USING (role = 'psychologist');

-- Permitir que cada psicólogo pueda ver los perfiles de los pacientes con citas asignadas
CREATE POLICY "Psychologists can view assigned patients"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.patient_id = id
      AND a.psychologist_id = auth.uid()
  )
);
