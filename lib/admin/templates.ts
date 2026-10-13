import config from '../../config';

export type TemplateVars = {
  first_name: string;
  last_name?: string;
  package: string;
  reference: string;
  staff_name: string;
  payment_instructions?: string;
  office_address?: string;
};

const KNOWN = ['first_name', 'last_name', 'package', 'reference', 'staff_name', 'payment_instructions', 'office_address'];

/** Replaces {{placeholders}}; unknown placeholders are left visible so staff notice them before sending. */
export function renderTemplate(body: string, vars: TemplateVars): string {
  return body.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (match, key: string) => {
    const value = (vars as Record<string, string | undefined>)[key];
    return KNOWN.includes(key) && value ? value : match;
  });
}

export const PLACEHOLDERS = KNOWN;

/** Payment instructions come from the site configuration so there is one place to update them. */
export function defaultPaymentInstructions(): string {
  const {address, phones} = config.contact;
  const phone = phones?.[0]?.label ? ` ou par WhatsApp au ${phones[0].label}` : '';
  return `au bureau (${address.streetAddress}, ${address.locality}, ${address.country})${phone}.`;
}

export function officeAddress(): string {
  const {address} = config.contact;
  return `${address.name}, ${address.streetAddress}, ${address.locality}, ${address.country}`;
}
