const SUPABASE_ERROR_MAP: Array<{ match: RegExp; message: string }> = [
  {
    match: /invalid login credentials/i,
    message: 'Correo o contraseña incorrectos.',
  },
  {
    match: /email not confirmed/i,
    message: 'Debes confirmar tu correo antes de iniciar sesión.',
  },
  {
    match: /user already exists/i,
    message: 'Ya existe una cuenta registrada con este correo.',
  },
  {
    match: /password should be at least (\d+)/i,
    message: 'La contraseña debe tener al menos $1 caracteres.',
  },
  {
    match: /new password should be different/i,
    message: 'La nueva contraseña debe ser diferente a la anterior.',
  },
  {
    match: /token has expired/i,
    message: 'El enlace expiró. Solicita uno nuevo.',
  },
  {
    match: /invalid or expired otp/i,
    message: 'El enlace no es válido o ya fue utilizado.',
  },
  {
    match: /too many requests/i,
    message: 'Demasiados intentos. Intenta nuevamente más tarde.',
  },
  {
    match: /user not found/i,
    message: 'No encontramos una cuenta con este correo.',
  },
];

export function translateSupabaseError(error: unknown, fallback: string): string {
  if (!error) return fallback;

  const message =
    typeof error === 'string'
      ? error
      : typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string'
        ? (error as any).message
        : '';

  if (!message) return fallback;

  for (const { match, message: result } of SUPABASE_ERROR_MAP) {
    const matches = message.match(match);
    if (matches) {
      let translated = result;
      matches.slice(1).forEach((value, index) => {
        const placeholder = `$${index + 1}`;
        translated = translated.replace(placeholder, String(value));
      });
      return translated;
    }
  }

  return fallback;
}
