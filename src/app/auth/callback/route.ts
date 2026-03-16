import { createClient } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const redirect = requestUrl.searchParams.get('redirect');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // SIEMPRE respetar el parámetro redirect si existe (ej: cuando viene del blog)
  // Solo usar /blog como fallback si no hay redirect especificado
  const redirectUrl = redirect && redirect.trim() !== '' ? redirect : '/blog';
  
  return NextResponse.redirect(new URL(redirectUrl, requestUrl.origin));
}
