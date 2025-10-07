-- Script para crear psicólogo de prueba
-- IMPORTANTE: Ejecuta este script DESPUÉS de crear manualmente el usuario en Supabase Auth

-- Ejemplo de cómo crear el usuario de prueba:
-- 1. Ve a Authentication > Users en Supabase Dashboard
-- 2. Crea un nuevo usuario con:
--    Email: psicologo@test.com
--    Password: Test123456
--    User Metadata:
--      {
--        "full_name": "Ana Marcela Polo Bastidas",
--        "birthdate": "1990-05-15",
--        "gender": "Femenino"
--      }

-- 3. Copia el UUID del usuario creado y reemplaza 'USER_ID_AQUI' abajo

-- Actualizar rol a psychologist
UPDATE profiles
SET role = 'psychologist'
WHERE id = 'USER_ID_AQUI'; -- Reemplaza con el UUID del usuario

-- Insertar disponibilidad de ejemplo (Lunes a Viernes, 9am-5pm)
INSERT INTO psychologist_availability (psychologist_id, day_of_week, start_time, end_time, is_available)
VALUES
  ('USER_ID_AQUI', 1, '09:00', '17:00', true), -- Lunes
  ('USER_ID_AQUI', 2, '09:00', '17:00', true), -- Martes
  ('USER_ID_AQUI', 3, '09:00', '17:00', true), -- Miércoles
  ('USER_ID_AQUI', 4, '09:00', '17:00', true), -- Jueves
  ('USER_ID_AQUI', 5, '09:00', '17:00', true); -- Viernes

-- Nota: day_of_week: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado