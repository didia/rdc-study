import messages from '../../src/locales/fr.json';

const dictionary = messages as Record<string, string>;
const country = (code: string) => dictionary[`shared.countries.${code}`];

// Countries the assistance form offers as "origin" (same list as AboutCandidateStep), plus "Autre".
const ORIGIN_CODES = [
  'cd', 'cg', 'gn', 'ga', 'ci', 'ne', 'tg', 'bf', 'bi', 'bj', 'cf', 'cm', 'dj', 'dz', 'gb', 'gh', 'km', 'ma', 'mg',
  'ml', 'mu', 'rw', 'sa', 'sc', 'sn', 'td', 'tn', 'be', 'br', 'ca', 'ch', 'cn', 'cytr', 'de', 'fr', 'ht', 'in', 'jp',
  'ro', 'ru', 'tr', 'us',
];
export const OTHER_COUNTRY = 'Autre';
export const ORIGIN_COUNTRIES: string[] = [...ORIGIN_CODES.map(country), OTHER_COUNTRY];

export const DESTINATION_COUNTRIES: string[] = ['be', 'ca', 'cytr', 'fr', 'in', 'tn', 'tr', 'us', 'ro'].map(country);

// Destination slugs used by the public form (DestinationCountries values) -> canonical labels.
const DESTINATION_BY_SLUG: Record<string, string> = {
  belgique: 'Belgique',
  canada: 'Canada',
  france: 'France',
  inde: 'Inde',
  'chypre-du-nord': 'Chypre du Nord',
  usa: 'États-Unis',
  tunisie: 'Tunisie',
  turquie: 'Turquie',
  roumanie: 'Roumanie',
};

export function destinationFromSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return DESTINATION_BY_SLUG[slug.trim().toLowerCase()] ?? normalizeCountry(slug, DESTINATION_COUNTRIES);
}

export const SERVICE_TYPES = [
  {code: 'assistance', label: 'Assistance'},
  {code: 'consultation', label: 'Consultation'},
  {code: 'verification', label: 'Vérification de dossier'},
  {code: 'verification-et-lettre', label: 'Vérification + lettre d’explication'},
  {code: 'information', label: 'Information (guide gratuit)'},
] as const;
export type ServiceType = (typeof SERVICE_TYPES)[number]['code'];

export const serviceLabel = (code: string) => SERVICE_TYPES.find((s) => s.code === code)?.label ?? code;

export const SOURCES = [
  {code: 'website_form', label: 'Formulaire du site'},
  {code: 'manual', label: 'Saisie manuelle'},
  {code: 'whatsapp', label: 'WhatsApp'},
  {code: 'referral', label: 'Recommandation'},
] as const;
export type RequestSource = (typeof SOURCES)[number]['code'];
export const sourceLabel = (code: string) => SOURCES.find((s) => s.code === code)?.label ?? code;

/** Sources a staff member may pick when entering a request by hand. */
export const MANUAL_SOURCES = SOURCES.filter((s) => s.code !== 'website_form');

export const CHANNELS = [
  {code: 'whatsapp', label: 'WhatsApp'},
  {code: 'email', label: 'E-mail'},
  {code: 'phone', label: 'Téléphone'},
  {code: 'office', label: 'Bureau'},
  {code: 'other', label: 'Autre'},
] as const;
export type Channel = (typeof CHANNELS)[number]['code'];
export const channelLabel = (code: string | null) => CHANNELS.find((c) => c.code === code)?.label ?? code ?? '';

const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/** Canonical label from a controlled list for free text (case/accent/punctuation-insensitive), or null. */
export function normalizeCountry(input: string | null | undefined, list: string[]): string | null {
  if (!input) return null;
  const wanted = fold(input);
  if (!wanted) return null;
  return list.find((label) => fold(label) === wanted) ?? null;
}

/**
 * Best-effort E.164. Only numbers written in international form (`+243…` or `00243…`) are accepted;
 * a local number cannot be completed reliably, so it returns null and the console asks for it.
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  let digits = trimmed.replace(/[^\d]/g, '');
  if (trimmed.startsWith('+')) {
    // keep digits
  } else if (digits.startsWith('00')) {
    digits = digits.slice(2);
  } else {
    return null;
  }
  // `+243 (0) 81…` style: a trunk 0 right after the country code is not part of the number.
  if (/\(0\)/.test(trimmed)) digits = digits.replace(/^(\d{1,3})0/, '$1');
  if (digits.length < 8 || digits.length > 15 || digits.startsWith('0')) return null;
  return `+${digits}`;
}

export const whatsappLink = (phoneE164: string | null, text?: string) =>
  phoneE164 ? `https://wa.me/${phoneE164.replace('+', '')}${text ? `?text=${encodeURIComponent(text)}` : ''}` : null;
