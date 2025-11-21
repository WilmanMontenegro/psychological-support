'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { translateSupabaseError } from '@/lib/errorMessages';
import toast from 'react-hot-toast';

type ResetStatus = 'initial' | 'checking' | 'ready' | 'updating' | 'success' | 'error';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ResetStatus>('initial');
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const hasExchanged = useRef(false);

  useEffect(() => {
    const verifyCode = async () => {
      if (typeof window === 'undefined') return;

      try {
        setStatus('checking');
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get('code');

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);

          if (error) throw error;

          router.replace('/reset-password');
          setStatus('ready');
          return;
        }

        const hash = window.location.hash.replace('#', '');
        const params = new URLSearchParams(hash);
        const type = params.get('type');
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (type !== 'recovery' || !accessToken || !refreshToken) {
          setErrorMessage('El enlace de recuperación no es válido o ya fue utilizado.');
          setStatus('error');
          return;
        }

        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          throw error;
        }

        // Limpiar el hash para evitar que se procese de nuevo al refrescar
        window.history.replaceState({}, document.title, window.location.pathname);
        setStatus('ready');
      } catch (error) {
        console.error('Error al validar código de reseteo:', error);
        setErrorMessage(
          translateSupabaseError(
            error,
            'El enlace expiró o ya fue utilizado. Solicita un nuevo correo de recuperación.'
          )
        );
        setStatus('error');
      }
    };

    if (!hasExchanged.current) {
      hasExchanged.current = true;
      verifyCode();
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden.');
      return;
    }

    try {
      setStatus('updating');
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        throw error;
      }

      toast.success('Contraseña actualizada correctamente.');
      setStatus('success');

      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      toast.error(translateSupabaseError(error, 'No se pudo actualizar la contraseña.'));
      setStatus('ready');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'initial':
      case 'checking':
        return (
          <div className="text-center">
            <p className="text-gray-600">Validando tu enlace de recuperación...</p>
          </div>
        );
      case 'error':
        return (
          <div className="text-center space-y-4">
            <p className="text-red-600">{errorMessage}</p>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 text-white rounded-md font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              Volver al inicio de sesión
            </button>
          </div>
        );
      case 'success':
        return (
          <div className="text-center space-y-4">
            <p className="text-accent font-semibold text-lg">¡Listo!</p>
            <p className="text-gray-600">Te estamos redirigiendo al login...</p>
          </div>
        );
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary"
                placeholder="Repite tu contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'updating'}
              className="w-full py-3 text-white rounded-md font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-secondary)' }}
            >
              {status === 'updating' ? 'Guardando...' : 'Actualizar contraseña'}
            </button>
          </form>
        );
    }
  };

  return (
    <div className="flex flex-1 w-full items-center justify-center bg-pastel-light px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 sm:p-10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-libre-baskerville text-accent mb-2">
            Recuperar contraseña
          </h1>
          <div className="w-16 h-1 bg-secondary rounded-full mx-auto"></div>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
