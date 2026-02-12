-- Tabla para almacenar likes de comentarios del blog
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Un usuario solo puede dar un like por comentario
    UNIQUE(comment_id, user_id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad

-- 1. Cualquiera puede ver los likes (para contar)
CREATE POLICY "Likes son públicos"
ON comment_likes FOR SELECT
USING (true);

-- 2. Solo usuarios autenticados pueden dar like
CREATE POLICY "Usuarios autenticados pueden dar like"
ON comment_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3. Usuarios pueden quitar su propio like
CREATE POLICY "Usuarios pueden quitar su like"
ON comment_likes FOR DELETE
USING (auth.uid() = user_id);

-- Índices para mejorar rendimiento
CREATE INDEX comment_likes_comment_id_idx ON comment_likes (comment_id);
CREATE INDEX comment_likes_user_id_idx ON comment_likes (user_id);
