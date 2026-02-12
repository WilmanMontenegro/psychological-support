-- Tabla para almacenar comentarios del blog
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_slug TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL CHECK (char_length(content) > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad

-- 1. Cualquiera puede leer comentarios (Público)
CREATE POLICY "Comentarios públicos" 
ON comments FOR SELECT 
USING (true);

-- 2. Solo usuarios autenticados pueden comentar
CREATE POLICY "Usuarios autenticados pueden comentar" 
ON comments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 3. Usuarios pueden borrar sus propios comentarios
CREATE POLICY "Usuarios pueden borrar sus comentarios" 
ON comments FOR DELETE 
USING (auth.uid() = user_id);

-- Índices para mejorar rendimiento
CREATE INDEX comments_post_slug_idx ON comments (post_slug);
CREATE INDEX comments_created_at_idx ON comments (created_at DESC);
