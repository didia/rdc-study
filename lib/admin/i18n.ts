import messages from '../../src/locales/fr.json';

const dictionary = messages as Record<string, string>;

// Minimal server/client-safe translator for the admin console ({name} placeholders only).
export function t(key: string, values?: Record<string, string | number>): string {
  const template = dictionary[key] ?? key;
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? `{${name}}`));
}
