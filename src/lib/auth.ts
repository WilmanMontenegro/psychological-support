import { supabase } from './supabase';

export type UserRole = 'admin' | 'psychologist' | 'patient';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  birthdate?: string;
  gender?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

function isAuthSessionMissingError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = 'name' in error ? (error as any).name : undefined;
  const message = 'message' in error ? (error as any).message : undefined;

  if (typeof name === 'string' && name === 'AuthSessionMissingError') {
    return true;
  }

  if (typeof message === 'string' && message.toLowerCase().includes('session missing')) {
    return true;
  }

  return false;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    if (isAuthSessionMissingError(sessionError)) {
      return null;
    }

    const error = new Error(sessionError.message ?? 'No se pudo verificar la sesión activa.');
    (error as any).cause = sessionError;
    throw error;
  }

  let activeSession = session;

  if (!activeSession?.user) {
    const {
      data: refreshed,
      error: refreshError,
    } = await supabase.auth.refreshSession();

    if (refreshError) {
      if (isAuthSessionMissingError(refreshError)) {
        return null;
      }

      const error = new Error(refreshError.message ?? 'No se pudo actualizar la sesión del usuario.');
      (error as any).cause = refreshError;
      throw error;
    }

    activeSession = refreshed.session ?? null;
  }

  const user = activeSession?.user;

  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    const error = new Error(profileError.message ?? 'No se pudo recuperar el perfil del usuario.');
    (error as any).cause = profileError;
    throw error;
  }

  return profile ?? null;
}

export async function checkUserRole(allowedRoles: UserRole[]): Promise<boolean> {
  const profile = await getUserProfile();

  if (!profile) return false;

  return allowedRoles.includes(profile.role);
}
