'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/auth';
import type { UserProfile } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaTrash, FaCircleUser, FaHeart, FaRegHeart } from 'react-icons/fa6';

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: {
        full_name: string;
    };
    likes_count?: number;
    user_has_liked?: boolean;
}

interface CommentsSectionProps {
    slug: string;
}

export default function CommentsSection({ slug }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        checkUser().finally(() => setAuthChecked(true));
    }, []);

    const fetchComments = useCallback(async () => {
        try {
            // Obtener comentarios
            const { data: commentsData, error: commentsError } = await supabase
                .from('comments')
                .select('*')
                .eq('post_slug', slug)
                .order('created_at', { ascending: false });

            if (commentsError) throw commentsError;

            if (commentsData && commentsData.length > 0) {
                const commentIds = commentsData.map(c => c.id);
                const userIds = commentsData.map(c => c.user_id);

                // Obtener perfiles
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds);

                if (profilesError) {
                    console.error('Error obteniendo perfiles:', profilesError);
                    toast.error('Error al cargar nombres de usuarios');
                }

                // Obtener todos los likes de estos comentarios
                const { data: likesData, error: likesError } = await supabase
                    .from('comment_likes')
                    .select('comment_id, user_id')
                    .in('comment_id', commentIds);

                if (likesError) {
                    console.error('Error obteniendo likes:', likesError);
                    // Continuar de todos modos, solo sin datos de likes
                }

                // Calcular likes por comentario y si el usuario actual dio like
                const currentUserId = user?.id;

                // Combinar todo
                const enrichedComments = commentsData.map(comment => {
                    const profile = profilesData?.find(p => p.id === comment.user_id);
                    const commentLikes = likesData?.filter(l => l.comment_id === comment.id) || [];
                    const userHasLiked = currentUserId ? commentLikes.some(l => l.user_id === currentUserId) : false;

                    return {
                        ...comment,
                        profiles: profile || null,
                        likes_count: commentLikes.length,
                        user_has_liked: userHasLiked
                    };
                });

                setComments(enrichedComments);
            } else {
                setComments([]);
            }
        } catch (error) {
            console.error('Error cargando comentarios:', error);
            toast.error('Error al cargar comentarios');
        } finally {
            setLoading(false);
        }
    }, [slug, user]);

    useEffect(() => {
        if (authChecked) {
            fetchComments();
        }
    }, [fetchComments, authChecked]);

    const checkUser = async () => {
        try {
            const profile = await getUserProfile();
            setUser(profile);
        } catch (error) {
            console.error('Error verificando usuario:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Debes iniciar sesión para comentar');
            return;
        }
        if (!newComment.trim()) {
            toast.error('El comentario no puede estar vacío');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    post_slug: slug,
                    user_id: user.id,
                    content: newComment.trim()
                })
                .select()
                .single();

            if (error) {
                console.error('Error al insertar:', error);
                throw error;
            }

            toast.success('¡Comentario publicado!');
            setNewComment('');

            // Recargar comentarios después de un momento para asegurar consistencia
            setTimeout(() => {
                fetchComments();
            }, 500);
        } catch (error) {
            console.error('Error publicando comentario:', error);

            // Mensajes de error más específicos
            const err = error as { message?: string; code?: string };
            if (err?.message?.includes('permission')) {
                toast.error('No tienes permisos para comentar. Verifica tu sesión.');
            } else if (err?.code === '23503') {
                toast.error('Error: Tu perfil no está configurado correctamente.');
            } else {
                toast.error('No se pudo publicar el comentario. Intenta de nuevo.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

        try {
            const { error } = await supabase
                .from('comments')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Comentario eliminado');
            setComments(comments.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error eliminando comentario:', error);
            toast.error('No se pudo eliminar');
        }
    };

    const handleLike = async (commentId: string) => {
        if (!user) {
            toast.error('Debes iniciar sesión para dar like');
            return;
        }

        const comment = comments.find(c => c.id === commentId);
        if (!comment) return;

        try {
            if (comment.user_has_liked) {
                // Quitar like
                const { error } = await supabase
                    .from('comment_likes')
                    .delete()
                    .eq('comment_id', commentId)
                    .eq('user_id', user.id);

                if (error) {
                    console.error('Error DELETE likes:', error);
                    throw error;
                }

                // Actualizar estado local
                setComments(comments.map(c => c.id === commentId ? {
                    ...c,
                    likes_count: (c.likes_count || 0) - 1,
                    user_has_liked: false
                } : c));
            } else {
                // Dar like
                const { error } = await supabase
                    .from('comment_likes')
                    .insert({
                        comment_id: commentId,
                        user_id: user.id
                    });

                if (error) {
                    console.error('Error INSERT likes:', error);
                    throw error;
                }

                // Actualizar estado local
                setComments(comments.map(c => c.id === commentId ? {
                    ...c,
                    likes_count: (c.likes_count || 0) + 1,
                    user_has_liked: true
                } : c));
            }
        } catch (error) {
            console.error('Error completo con like:', error);
            const err = error as { code?: string; message?: string };

            if (err?.code === '23505') {
                toast.error('Ya diste like a este comentario');
            } else if (err?.code === '42P01') {
                toast.error('Error: La tabla de likes no existe. Contacta al administrador.');
            } else if (err?.message?.includes('permission')) {
                toast.error('Error de permisos. Verifica tu sesión.');
            } else {
                toast.error(`Error al procesar el like: ${err?.message || 'desconocido'}`);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="mt-16 pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-libre-baskerville text-accent mb-8">
                Comentarios ({comments.length})
            </h3>

            {/* Formulario */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-secondary/10 p-2 rounded-full text-secondary">
                            <FaCircleUser size={24} />
                        </div>
                        <span className="font-medium text-gray-700">Comentar como {user.full_name}</span>
                    </div>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escribe tu comentario aquí..."
                        className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none min-h-[100px] resize-y mb-4"
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition disabled:opacity-50 font-medium"
                    >
                        {submitting ? 'Publicando...' : 'Publicar comentario'}
                    </button>
                </form>
            ) : (
                <div className="mb-10 p-8 bg-pastel-light rounded-xl text-center border border-secondary/20">
                    <p className="text-gray-600 mb-4 text-lg">Inicia sesión para compartir tu opinión</p>
                    <Link
                        href={`/login?redirect=/blog/${slug}`}
                        className="inline-block px-6 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition font-medium shadow-sm"
                    >
                        Iniciar Sesión
                    </Link>
                </div>
            )}

            {/* Lista de comentarios */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="animate-pulse flex gap-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-16 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : comments.length > 0 ? (
                <div className="space-y-4">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-11 h-11 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full flex items-center justify-center text-accent font-bold text-lg shadow-sm">
                                        {comment.profiles?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                                        <h4 className="font-semibold text-gray-800 text-base">
                                            {comment.profiles?.full_name || 'Usuario'}
                                        </h4>
                                        <span className="text-xs text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base mb-3">
                                        {comment.content}
                                    </p>

                                    {/* Acciones del comentario */}
                                    <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                                        {/* Botón de like */}
                                        <button
                                            onClick={() => handleLike(comment.id)}
                                            className={`flex items-center gap-1.5 text-sm font-medium transition-all rounded-full px-3 py-1.5 ${comment.user_has_liked
                                                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                                : 'text-gray-500 bg-gray-50 hover:bg-red-50 hover:text-red-500'
                                                }`}
                                            title={user ? (comment.user_has_liked ? 'Quitar like' : 'Me gusta') : 'Inicia sesión para dar like'}
                                        >
                                            {comment.user_has_liked ? (
                                                <FaHeart className="text-base" />
                                            ) : (
                                                <FaRegHeart className="text-base" />
                                            )}
                                            <span>{comment.likes_count || 0}</span>
                                        </button>

                                        {/* Botón eliminar (solo si es el autor o admin) */}
                                        {user && (user.id === comment.user_id || user.role === 'admin') && (
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-red-400 hover:text-red-600 text-xs flex items-center gap-1.5 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
                                            >
                                                <FaTrash size={11} />
                                                <span>Eliminar</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500 italic">
                    No hay comentarios aún. ¡Sé el primero en comentar!
                </div>
            )}
        </div>
    );
}
