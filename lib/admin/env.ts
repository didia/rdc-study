// Supabase configuration. Everything degrades gracefully when the variables are missing
// (the public site must keep working without the admin backend).

export function getSupabasePublicConfig(): {url: string; anonKey: string} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? {url, anonKey} : null;
}

export function isAdminConfigured(): boolean {
  return getSupabasePublicConfig() !== null;
}

export function getServiceRoleKey(): string | null {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}
