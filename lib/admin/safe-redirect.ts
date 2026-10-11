const FALLBACK = '/admin';

// Only allow same-origin paths under /admin, so `?next=` can never become an open redirect.
export function safeAdminPath(next: string | null | undefined, fallback: string = FALLBACK): string {
  if (!next || typeof next !== 'string') return fallback;
  if (!next.startsWith('/admin')) return fallback;
  if (next.startsWith('//') || next.includes('\\') || /[\u0000-\u001f]/.test(next)) return fallback;
  const rest = next.slice('/admin'.length);
  if (rest !== '' && !/^[/?#]/.test(rest)) return fallback;
  return next;
}
