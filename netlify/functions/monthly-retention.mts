import type {Config} from '@netlify/functions';

// First of the month, 06:00 UTC. The app route decides between a dry run and a real run (setting `retention_auto`).
export default async () => {
  const base = process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) return new Response('retention not configured', {status: 200});
  const response = await fetch(`${base}/api/cron/retention`, {method: 'POST', headers: {Authorization: `Bearer ${secret}`}});
  return new Response(`retention: ${response.status}`, {status: 200});
};

export const config: Config = {schedule: '0 6 1 * *'};
