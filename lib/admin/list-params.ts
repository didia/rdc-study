// URL <-> filters for the requests list. The URL is the single source of truth, so every filtered
// view is shareable and survives a reload.

export const PAGE_SIZE = 25;
export const STALE_AFTER_DAYS = 7;

export const SORTS = ['submitted_at', 'last_activity_at', 'reference', 'status'] as const;
export type SortKey = (typeof SORTS)[number];

export type ListParams = {
  q: string;
  status: string[];
  service: string;
  destination: string;
  origin: string;
  assignee: string; // '' | 'none' | 'me' | uuid
  source: string;
  from: string; // yyyy-mm-dd
  to: string;
  sort: SortKey;
  dir: 'asc' | 'desc';
  page: number;
};

type Raw = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? '';
const many = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value : value ? [value] : []).flatMap((v) => v.split(',')).map((v) => v.trim()).filter(Boolean);
const date = (value: string) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '');

export function parseListParams(raw: Raw): ListParams {
  const sortRaw = one(raw.sort);
  const sort = (SORTS as readonly string[]).includes(sortRaw) ? (sortRaw as SortKey) : 'submitted_at';
  const page = Number.parseInt(one(raw.page), 10);
  return {
    q: one(raw.q).trim().slice(0, 100),
    status: many(raw.status),
    service: one(raw.service),
    destination: one(raw.destination),
    origin: one(raw.origin),
    assignee: one(raw.assignee),
    source: one(raw.source),
    from: date(one(raw.from)),
    to: date(one(raw.to)),
    sort,
    dir: one(raw.dir) === 'asc' ? 'asc' : 'desc',
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/** Serialise only non-default values, so URLs stay short. */
export function toQueryString(params: Partial<ListParams>): string {
  const search = new URLSearchParams();
  if (params.q) search.set('q', params.q);
  if (params.status?.length) search.set('status', params.status.join(','));
  for (const key of ['service', 'destination', 'origin', 'assignee', 'source', 'from', 'to'] as const) {
    if (params[key]) search.set(key, params[key] as string);
  }
  if (params.sort && params.sort !== 'submitted_at') search.set('sort', params.sort);
  if (params.dir === 'asc') search.set('dir', 'asc');
  if (params.page && params.page > 1) search.set('page', String(params.page));
  const text = search.toString();
  return text ? `?${text}` : '';
}

/** Characters with a meaning in PostgREST `or=(…)` / `ilike` filters are dropped from search terms. */
export function searchTerms(q: string): string[] {
  return q
    .replace(/[,()*"\\%_:]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);
}

export function isStale(lastActivityAt: string, stage: string, now = Date.now()): boolean {
  if (stage !== 'open') return false;
  return now - new Date(lastActivityAt).getTime() > STALE_AFTER_DAYS * 86_400_000;
}
