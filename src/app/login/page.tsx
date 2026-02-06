'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUserProfile } from '@/lib/auth';
import { translateSupabaseError } from '@/lib/errorMessages';
import Link from 'next/link';
import toast from 'react-hot-toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true' && !hasShownToast.current) {
      hasShownToast.current = true;
      toast.success('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      router.replace('/login');
    }
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Ingresa tu correo para enviarte el enlace de recuperación');
      return;
    }

    try {
      setResetting(true);
      const redirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/reset-password`
        : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo,
      });

      if (error) throw error;

      toast.success('Revisa tu correo para restablecer tu contraseña');
    } catch (err) {
      console.error('Error al enviar enlace de recuperación:', err);
      const message = translateSupabaseError(err, 'No se pudo enviar el correo de recuperación');
      toast.error(message);
    } finally {
      setResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (signInError) throw signInError;

      // Leer el parámetro redirect del URL
      const redirectParam = searchParams.get('redirect');
      let redirectPath = redirectParam || '/mis-citas';

      // Solo sobrescribir si no hay redirect y el usuario tiene un rol específico
      if (!redirectParam) {
        try {
          const profile = await getUserProfile();

          if (!profile) {
            console.warn('Perfil no encontrado tras iniciar sesión. Se usará la ruta por defecto.');
          } else if (profile.role === 'psychologist' || profile.role === 'admin') {
            redirectPath = '/mis-citas';
          } else if (profile.role === 'patient') {
            redirectPath = '/mis-citas';
          }
        } catch (profileError) {
          console.error('Error al obtener perfil tras iniciar sesión:', profileError);
        }
      }

      toast.success('¡Bienvenido! Sesión iniciada correctamente');

      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    } catch (err) {
      const message = translateSupabaseError(err, 'Error al iniciar sesión');
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6">
      <div>
        <h2 className="text-center text-3xl font-libre-baskerville text-accent">
          Iniciar Sesión
        </h2>
        <div className="w-16 h-1 bg-secondary rounded-full mx-auto mt-4"></div>
        <p className="mt-4 text-center text-gray-600">
          Ingresa a tu cuenta para continuar
        </p>
      </div>

      <div className="mt-8">
        <button
          onClick={() => {
            setLoading(true);
            const redirectParam = searchParams.get('redirect');
            const callbackUrl = redirectParam
              ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectParam)}`
              : `${window.location.origin}/auth/callback`;

            supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: callbackUrl
              }
            });
          }}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 font-medium transition-colors"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Continuar con Google
        </button>



        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-tertiary-light text-gray-500">O continúa con email</span>
          </div>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              placeholder="Tu contraseña"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-secondary)' }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="font-medium hover:underline" style={{ color: 'var(--color-secondary)' }}>
              Regístrate aquí
            </Link>
          </p>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetting}
            className="mt-3 text-sm font-medium hover:underline disabled:opacity-50"
            style={{ color: 'var(--color-secondary)' }}
          >
            {resetting ? 'Enviando enlace...' : '¿Olvidaste tu contraseña?'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-tertiary-light py-8 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-gray-600">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
