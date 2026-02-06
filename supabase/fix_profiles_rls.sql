-- Arreglar políticas RLS de profiles para permitir lectura pública de nombres
-- Solo para mostrar nombres en comentarios del blog

-- Política para permitir que cualquiera pueda ver id y full_name de profiles
-- (necesario para mostrar nombres en comentarios del blog)
CREATE POLICY "Nombres de perfiles son públicos"
ON profiles FOR SELECT
USING (true);

-- Si ya existe una política similar, primero elimínala:
-- DROP POLICY IF EXISTS "Nombres de perfiles son públicos" ON profiles;
