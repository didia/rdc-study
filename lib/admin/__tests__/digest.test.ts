import {describe, expect, it} from 'vitest';

import {buildDigest, digestEmail, digestIsEmpty, newRequestEmail, type DigestRequest} from '../digest';

const now = Date.parse('2026-10-20T07:00:00Z');
const req = (over: Partial<DigestRequest>): DigestRequest => ({
  id: Math.random().toString(36).slice(2),
  reference: 'RDC-2026-0001',
  status: 'contacted',
  assigned_to: 'u1',
  next_follow_up_at: null,
  last_activity_at: '2026-10-19T00:00:00Z',
  clientName: 'Amani Mbuyi',
  ...over,
});

describe('digest', () => {
  const rows = [
    req({id: 'a', next_follow_up_at: '2026-10-19T00:00:00Z'}),
    req({id: 'b', status: 'in_discussion', last_activity_at: '2026-10-01T00:00:00Z'}),
    req({id: 'c', status: 'new', assigned_to: null, last_activity_at: '2026-10-19T00:00:00Z'}),
    req({id: 'd', assigned_to: 'u2', next_follow_up_at: '2026-10-01T00:00:00Z'}),
  ];

  it('gives an agent only their own overdue and waiting requests', () => {
    const d = buildDigest(rows, 'u1', 'agent', now);
    expect(d.overdue.map((r) => r.id)).toEqual(['a']);
    expect(d.waiting.map((r) => r.id)).toEqual(['b']);
    expect(d.unassignedNew).toEqual([]);
  });

  it('adds unassigned new requests for admins', () => {
    expect(buildDigest(rows, 'admin1', 'admin', now).unassignedNew.map((r) => r.id)).toEqual(['c']);
  });

  it('is empty when there is nothing to do, so no email is sent', () => {
    expect(digestIsEmpty(buildDigest([], 'u1', 'agent', now))).toBe(true);
  });

  it('builds a readable email with links, escaping client names', () => {
    const d = buildDigest([req({id: 'x', next_follow_up_at: '2026-10-19T00:00:00Z', clientName: '<b>Eve</b>'})], 'u1', 'agent', now);
    const mail = digestEmail('Agent', d, 'https://www.rdcetudes.com');
    expect(mail.subject).toContain('1 demande');
    expect(mail.text).toContain('https://www.rdcetudes.com/admin/demandes/x');
    expect(mail.html).toContain('&lt;b&gt;Eve&lt;/b&gt;');
    expect(mail.html).not.toContain('<b>Eve');
  });

  it('builds the new-request email', () => {
    const mail = newRequestEmail({reference: 'RDC-2026-0009', clientName: 'Grace K', service: 'Assistance', destination: 'Canada', requestId: 'id1', baseUrl: 'https://x.test'});
    expect(mail.subject).toBe('Nouvelle demande RDC-2026-0009 – Grace K');
    expect(mail.text).toContain('https://x.test/admin/demandes/id1');
  });
});
