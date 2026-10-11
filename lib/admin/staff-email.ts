// Optional belt-and-braces: restrict staff invitations to a list of email domains
// (ADMIN_ALLOWED_EMAIL_DOMAINS="rdcetudes.com,gmail.com"). Empty/unset = no restriction.
export function isAllowedStaffEmail(email: string, allowedDomains = process.env.ADMIN_ALLOWED_EMAIL_DOMAINS): boolean {
  const domains = (allowedDomains ?? '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  if (domains.length === 0) return true;
  const domain = email.trim().toLowerCase().split('@')[1];
  return !!domain && domains.includes(domain);
}
