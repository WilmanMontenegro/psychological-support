-- Agregar columna para extender el tiempo de la cita
ALTER TABLE appointments 
ADD COLUMN extension_minutes INTEGER DEFAULT 0;

-- Comentario para documentación
COMMENT ON COLUMN appointments.extension_minutes IS 'Minutos adicionales otorgados por el psicólogo para extender la ventana de chat';
