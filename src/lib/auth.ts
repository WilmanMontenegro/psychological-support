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

export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
}

export async function checkUserRole(allowedRoles: UserRole[]): Promise<boolean> {
  const profile = await getUserProfile();

  if (!profile) return false;

  return allowedRoles.includes(profile.role);
}