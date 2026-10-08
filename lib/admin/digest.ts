import {isOverdue, isWaitingTooLong} from './followup';

export type DigestRequest = {
  id: string;
  reference: string;
  status: string;
  assigned_to: string | null;
  next_follow_up_at: string | null;
  last_activity_at: string;
  clientName: string;
};

export type Digest = {overdue: DigestRequest[]; unassignedNew: DigestRequest[]; waiting: DigestRequest[]};

/** What one person should look at this morning. Unassigned new requests go to admins only. */
export function buildDigest(requests: DigestRequest[], userId: string, role: string, now: number = Date.now()): Digest {
  const mine = requests.filter((r) => r.assigned_to === userId);
  const overdue = mine.filter((r) => isOverdue(r.next_follow_up_at, now));
  const overdueIds = new Set(overdue.map((r) => r.id));
  return {
    overdue,
    unassignedNew: role === 'admin' ? requests.filter((r) => r.status === 'new' && !r.assigned_to) : [],
    waiting: mine.filter((r) => !overdueIds.has(r.id) && isWaitingTooLong(r.status, r.last_activity_at, now)),
  };
}

export const digestIsEmpty = (d: Digest) => d.overdue.length + d.unassignedNew.length + d.waiting.length === 0;

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'})[c]!);

export function digestEmail(name: string, digest: Digest, baseUrl: string): {subject: string; text: string; html: string} {
  const sections: [string, DigestRequest[]][] = [
    ['À relancer', digest.overdue],
    ['Nouvelles demandes non assignées', digest.unassignedNew],
    ['En attente depuis trop longtemps', digest.waiting],
  ];
  const lines = sections
    .filter(([, rows]) => rows.length)
    .map(([title, rows]) => `${title} (${rows.length})\n${rows.map((r) => `  - ${r.reference} ${r.clientName} : ${baseUrl}/admin/demandes/${r.id}`).join('\n')}`);
  const html = sections
    .filter(([, rows]) => rows.length)
    .map(
      ([title, rows]) =>
        `<h3>${esc(title)} (${rows.length})</h3><ul>${rows
          .map((r) => `<li><a href="${baseUrl}/admin/demandes/${r.id}">${esc(r.reference)}</a> ${esc(r.clientName)}</li>`)
          .join('')}</ul>`,
    )
    .join('');
  const total = digest.overdue.length + digest.unassignedNew.length + digest.waiting.length;
  return {
    subject: `RDC Études – ${total} demande(s) à traiter aujourd'hui`,
    text: `Bonjour ${name},\n\n${lines.join('\n\n')}\n\nConsole : ${baseUrl}/admin`,
    html: `<p>Bonjour ${esc(name)},</p>${html}<p><a href="${baseUrl}/admin">Ouvrir la console</a></p>`,
  };
}

export function newRequestEmail(args: {reference: string; clientName: string; service: string; destination: string | null; requestId: string; baseUrl: string}) {
  const url = `${args.baseUrl}/admin/demandes/${args.requestId}`;
  const detail = [args.service, args.destination].filter(Boolean).join(' · ');
  return {
    subject: `Nouvelle demande ${args.reference} – ${args.clientName}`,
    text: `Nouvelle demande reçue sur le site.\n\n${args.reference} – ${args.clientName}\n${detail}\n\n${url}`,
    html: `<p>Nouvelle demande reçue sur le site.</p><p><strong>${esc(args.reference)}</strong> – ${esc(args.clientName)}<br>${esc(detail)}</p><p><a href="${url}">Ouvrir la demande</a></p>`,
  };
}
