-- Tabla para mensajes de las citas
CREATE TABLE public.appointment_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL CHECK (char_length(message) > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_appointment_messages_appointment
ON public.appointment_messages(appointment_id, created_at DESC);

CREATE INDEX idx_appointment_messages_sender
ON public.appointment_messages(sender_id);

ALTER TABLE public.appointment_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read appointment messages"
ON public.appointment_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.id = appointment_id
      AND (
        a.patient_id = auth.uid()
        OR a.psychologist_id = auth.uid()
      )
  ) OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  ) OR auth.role() = 'service_role'
);

CREATE POLICY "Participants can insert appointment messages"
ON public.appointment_messages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.appointments a
    WHERE a.id = appointment_id
      AND (
        a.patient_id = auth.uid()
        OR a.psychologist_id = auth.uid()
      )
  ) OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  ) OR auth.role() = 'service_role'
);

CREATE POLICY "Participants can delete own appointment messages"
ON public.appointment_messages
FOR DELETE
USING (
  sender_id = auth.uid()
  OR EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.id = auth.uid()
      AND p.role = 'admin'
  ) OR auth.role() = 'service_role'
);

GRANT SELECT, INSERT, DELETE ON public.appointment_messages TO authenticated;
GRANT ALL ON public.appointment_messages TO service_role;
