import 'server-only';
import {headers} from 'next/headers';

import config from '../../config';

// Public origin of the current request (Netlify forwards the original host).
export async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) return config.siteURL;
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${proto}://${host}`;
}
