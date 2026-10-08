import {KIND_LABELS} from './catalogue-labels';

export const PRICED_SERVICES = [
  {code: 'assistance', label: 'Assistance', allowExceptions: true},
  {code: 'consultation', label: 'Consultation', allowExceptions: false},
  {code: 'verification', label: 'Vérification de dossier', allowExceptions: false},
  {code: 'verification-et-lettre', label: 'Vérification + lettre d’explication', allowExceptions: false},
  {code: 'information', label: 'Information (guide gratuit)', allowExceptions: false, locked: true},
  {code: 'guides-de-demarche', label: 'Guides de démarche (carte du site)', allowExceptions: false},
] as const;

export const SCOPE_PATTERN = /^(\*|(kind|pkg):[a-z0-9/-]+)$/;

export function scopeLabel(scope: string, packageLabel: (slug: string) => string): string {
  if (scope === '*') return 'Tarif par défaut';
  if (scope.startsWith('kind:')) {
    const kind = scope.slice(5);
    return KIND_LABELS[kind] ?? kind;
  }
  if (scope.startsWith('pkg:')) return `Exception : ${packageLabel(scope.slice(4))}`;
  return scope;
}

/** "450", "450,50" or "450.5" (dollars) -> cents, or null when invalid. */
export function dollarsToCents(input: string): number | null {
  const normalised = input.trim().replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalised)) return null;
  const cents = Math.round(Number(normalised) * 100);
  return cents <= 10_000_000 ? cents : null;
}
