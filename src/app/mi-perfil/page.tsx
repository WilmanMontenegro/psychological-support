'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/auth';
import toast from 'react-hot-toast';
import type { User } from '@supabase/supabase-js';

export default function MiPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    birthdate: '',
    gender: ''
  });

  const checkUser = useCallback(async () => {
    setError(null);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Error al obtener usuario:', authError);
      toast.error('No se pudo cargar tu perfil');
      setError('No se pudo cargar tu perfil.');
      setLoading(false);
      return;
    }

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      setProfile(profileData ?? null);
      setFormData({
        full_name: profileData?.full_name || user?.user_metadata?.full_name || '',
        birthdate: profileData?.birthdate || user?.user_metadata?.birthdate || '',
        gender: profileData?.gender || user?.user_metadata?.gender || ''
      });
    } catch (profileError) {
      console.error('Error al obtener perfil:', profileError);
      toast.error('No fue posible cargar la información completa del perfil');
      setError('No fue posible cargar la información completa del perfil.');
    }

    setLoading(false);
  }, [router]);

  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    void checkUser();
  }, [checkUser]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user || !formData.full_name.trim()) {
      toast.error('El nombre completo es obligatorio');
      return;
    }

    setIsSaving(true);

    try {
      // Actualizar en profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          birthdate: formData.birthdate || null,
          gender: formData.gender || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Actualizar user_metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.full_name,
          birthdate: formData.birthdate,
          gender: formData.gender
        }
      });

      if (metadataError) throw metadataError;

      setProfile({
        ...profile,
        full_name: formData.full_name,
        birthdate: formData.birthdate,
        gender: formData.gender
      } as UserProfile);

      toast.success('Perfil actualizado correctamente');
      setIsEditing(false);
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'ELIMINAR') {
      toast.error('Debes escribir "ELIMINAR" para confirmar');
      return;
    }

    setDeleting(true);

    try {
      // Eliminar cuenta del usuario
      const { error } = await supabase.rpc('delete_user');

      if (error) throw error;

      toast.success('Cuenta eliminada exitosamente');

      // Cerrar sesión y redirigir
      await supabase.auth.signOut();
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      toast.error('Error al eliminar la cuenta. Contacta con soporte.');
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No especificado';

    // Parsear fecha sin problemas de timezone
    const [year, month, day] = dateString.split('T')[0].split('-');
    if (!year || !month || !day) return dateString;

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getGenderText = (gender: string | null) => {
    if (!gender) return 'No especificado';
    switch (gender) {
      case 'masculino':
        return 'Masculino';
      case 'femenino':
        return 'Femenino';
      case 'otro':
        return 'Otro';
      case 'prefiero-no-decir':
        return 'Prefiero no decir';
      default:
        return gender;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pastel-light">
        <p className="text-gray-600">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            Mi Perfil
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
        </div>

        {/* Información del perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-accent">Información Personal</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90 transition text-sm font-medium"
              >
                Editar
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Género
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                >
                  <option value="">Seleccionar...</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>

              <div className="border-t border-gray-200 pt-4 flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-secondary text-white rounded-md hover:opacity-90 transition font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar cambios'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      full_name: profile?.full_name || user?.user_metadata?.full_name || '',
                      birthdate: profile?.birthdate || user?.user_metadata?.birthdate || '',
                      gender: profile?.gender || user?.user_metadata?.gender || ''
                    });
                  }}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-500">Nombre completo</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.full_name || 'No especificado'}
                </p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="text-lg font-medium text-gray-900">{user?.email}</p>
              </div>

              <div className="border-b border-gray-200 pb-3">
                <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                <p className="text-lg font-medium text-gray-900">
                  {formData.birthdate ? formatDate(formData.birthdate) : 'No especificado'}
                </p>
              </div>

              <div className="pb-3">
                <p className="text-sm text-gray-500">Género</p>
                <p className="text-lg font-medium text-gray-900">
                  {getGenderText(formData.gender)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Zona de peligro */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 border-2 border-red-200">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Zona de Peligro</h2>
          <p className="text-gray-600 mb-4">
            Eliminar tu cuenta es una acción <strong>permanente e irreversible</strong>.
            Todos tus datos, incluyendo tus citas, serán eliminados.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Escribe <strong>ELIMINAR</strong> para confirmar:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="ELIMINAR"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting || deleteConfirmText !== 'ELIMINAR'}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Eliminando...' : 'Confirmar eliminación'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                  disabled={deleting}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
