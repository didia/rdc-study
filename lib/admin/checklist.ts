// Delivery checklist per package. Items come from the package's own `services` list when the CMS content has one,
// otherwise from the defaults below (by package kind). State lives in service_requests.delivery_checklist.

export type ChecklistItem = {key: string; label: string};
export type ChecklistState = Record<string, {done: boolean; by?: string; at?: string}>;

const slug = (label: string) =>
  label
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 60);

const item = (label: string): ChecklistItem => ({key: slug(label), label});

const DEFAULTS: Record<string, string[]> = {
  admission: ['Choisir un programme', 'Préparer le dossier de candidature', 'Soumettre la candidature', 'Suivre la réponse de l’établissement', 'Obtenir la lettre d’admission'],
  caq: ['Préparer les documents du CAQ', 'Soumettre la demande de CAQ', 'Suivre le traitement', 'Obtenir le CAQ'],
  equivalence: ['Rassembler les documents scolaires', 'Soumettre la demande d’équivalence', 'Suivre le traitement', 'Obtenir l’équivalence'],
  visa: ['Préparer la demande de visa / permis d’études', 'Préparer le rendez-vous / la biométrie', 'Soumettre la demande', 'Suivre le traitement', 'Obtenir la décision'],
};
const GENERIC = ['Rencontre de démarrage', 'Préparer le dossier', 'Soumettre la demande', 'Suivi jusqu’à la décision'];

export function checklistFor(packageSlug: string | null, packageServices?: string[] | null): ChecklistItem[] {
  if (packageServices?.length) return packageServices.map(item);
  const kind = packageSlug?.split('/')[1];
  return (kind && DEFAULTS[kind] ? DEFAULTS[kind] : GENERIC).map(item);
}

export function progress(items: ChecklistItem[], state: ChecklistState | null | undefined) {
  const done = items.filter((i) => state?.[i.key]?.done).length;
  return {done, total: items.length};
}

export function toggled(state: ChecklistState | null | undefined, key: string, done: boolean, by: string, now = new Date()): ChecklistState {
  return {...(state ?? {}), [key]: {done, by, at: now.toISOString()}};
}
