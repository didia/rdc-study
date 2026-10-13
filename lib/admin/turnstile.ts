// Cloudflare Turnstile check for the public intake route.
// Only enforced when both the secret (server) and the site key (widget in the form) are configured:
// with the secret alone no visitor could ever send a token and every submission would be refused.

export function turnstileEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(env.TURNSTILE_SECRET_KEY && env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
}

export async function turnstileOk(
  token: string | undefined,
  remoteIp: string,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  if (!turnstileEnabled(env)) return true;
  if (!token) return false;
  try {
    const response = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({secret: env.TURNSTILE_SECRET_KEY as string, response: token, remoteip: remoteIp}),
    });
    return Boolean((await response.json()).success);
  } catch {
    return false;
  }
}
