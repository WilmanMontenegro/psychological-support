'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/auth';
import type { UserProfile } from '@/lib/auth';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FaTrash, FaCircleUser } from 'react-icons/fa6';

interface Comment {
    id: string;
    user_id: string;
    content: string;
    created_at: string;
    profiles?: {
        full_name: string;
    };
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

    useEffect(() => {
        fetchComments();
        checkUser();
    }, [slug]);

    const checkUser = async () => {
        try {
            const profile = await getUserProfile();
            setUser(profile);
        } catch (error) {
            console.error('Error verificando usuario:', error);
        }
    };

    const fetchComments = async () => {
        try {
            // Unimos con la tabla profiles para obtener el nombre (si existe tabla profiles vinculada)
            // Si no usas profiles en FK, tendrás que ajustar esto. Asumo que profiles existe por auth.ts
            const { data, error } = await supabase
                .from('comments')
                .select(`
          *,
          profiles (full_name)
        `)
                .eq('post_slug', slug)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setComments(data || []);
        } catch (error) {
            console.error('Error cargando comentarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('comments')
                .insert({
                    post_slug: slug,
                    user_id: user.id,
                    content: newComment.trim()
                });

            if (error) throw error;

            toast.success('Comentario publicado');
            setNewComment('');
            fetchComments(); // Recargar comentarios
        } catch (error) {
            console.error('Error publicando comentario:', error);
            toast.error('No se pudo publicar el comentario');
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
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
                            <div className="flex-shrink-0 mt-1">
                                <div className="w-10 h-10 bg-pastel-dark rounded-full flex items-center justify-center text-accent font-bold text-lg">
                                    {comment.profiles?.full_name?.charAt(0) || '?'}
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="font-semibold text-gray-800">
                                        {comment.profiles?.full_name || 'Usuario desconocido'}
                                    </h4>
                                    <span className="text-xs text-gray-500">
                                        {formatDate(comment.created_at)}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                                    {comment.content}
                                </p>
                                {/* Botón eliminar (solo si es el autor) */}
                                {user && user.id === comment.user_id && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="mt-2 text-red-400 hover:text-red-600 text-xs flex items-center gap-1 transition-colors"
                                    >
                                        <FaTrash size={12} /> Eliminar
                                    </button>
                                )}
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
