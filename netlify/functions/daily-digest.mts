import type {Config} from '@netlify/functions';

// 07:00 UTC = 08:00 in Kinshasa. Calls the app's digest route, which holds the logic and the credentials.
export default async () => {
  const base = process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response('digest not configured', {status: 200});
  const response = await fetch(`${base}/api/cron/digest`, {method: 'POST', headers: {Authorization: `Bearer ${secret}`}});
  return new Response(`digest: ${response.status}`, {status: 200});
};

export const config: Config = {schedule: '0 7 * * *'};
