import messages from '../../src/locales/fr.json';

const dictionary = messages as Record<string, string>;

// Minimal server/client-safe translator for the admin console ({name} placeholders only).
export function t(key: string, values?: Record<string, string | number>): string {
  const template = dictionary[key] ?? key;
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}

/** Translation when the key exists, otherwise the given fallback (e.g. a raw value from an external API). */
export const tOr = (key: string, fallback: string): string => dictionary[key] ?? fallback;
