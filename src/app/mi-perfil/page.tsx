'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function MiPerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/login');
      return;
    }

    setUser(user);
    setLoading(false);
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
    } catch (error: any) {
      console.error('Error al eliminar cuenta:', error);
      toast.error('Error al eliminar la cuenta. Contacta con soporte.');
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No especificado';
    return new Date(dateString).toLocaleDateString('es-ES', {
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-libre-baskerville text-accent mb-4">
            Mi Perfil
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto mb-6"></div>
        </div>

        {/* Información del perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 mb-6">
          <h2 className="text-xl font-semibold text-accent mb-4">Información Personal</h2>

          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500">Nombre completo</p>
              <p className="text-lg font-medium text-gray-900">
                {user?.user_metadata?.full_name || 'No especificado'}
              </p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500">Correo electrónico</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>

            <div className="border-b border-gray-200 pb-3">
              <p className="text-sm text-gray-500">Fecha de nacimiento</p>
              <p className="text-lg font-medium text-gray-900">
                {formatDate(user?.user_metadata?.birthdate)}
              </p>
            </div>

            <div className="pb-3">
              <p className="text-sm text-gray-500">Género</p>
              <p className="text-lg font-medium text-gray-900">
                {getGenderText(user?.user_metadata?.gender)}
              </p>
            </div>
          </div>
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
