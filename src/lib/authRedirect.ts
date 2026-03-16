export function sanitizeAuthRedirect(redirect: string | null | undefined, fallback = '/blog') {
  if (!redirect) {
    return fallback;
  }

  const trimmedRedirect = redirect.trim();

  if (!trimmedRedirect.startsWith('/') || trimmedRedirect.startsWith('//')) {
    return fallback;
  }

  return trimmedRedirect;
}